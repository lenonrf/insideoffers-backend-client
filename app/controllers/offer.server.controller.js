'use strict';


/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    async = require('async'),
    errorHandler = require('./errors'),
     _ = require('lodash'),
    request = require('request'),
    Affiliation = mongoose.model('Affiliation'),
    Offer = mongoose.model('Offer'),
    MyHall = mongoose.model('MyHall'),
    Segmentation = require('./segmentation'),
    MyHallController = require('./myhall'),
    ObjectId = mongoose.Types.ObjectId,
    stat = require('./stat');

 

exports.getDateToQuery = function (dateStart, dateEnd){

    // FORMAT: MM/DD/YYYY
    var dateStartSplited = dateStart.split('/');
    var dateEndSplited = dateEnd.split('/');

    return {
        dateStart :  new Date(dateStartSplited[2], (dateStartSplited[0]-1), dateStartSplited[1]),
        dateEnd :  new Date(dateEndSplited[2], (dateEndSplited[0]-1), dateEndSplited[1])
    }

};



exports.getQueryClicksGroupedByType = function(offerId, dateStart, dateEnd){

    var dateRangeQuery = exports.getDateToQuery(dateStart, dateEnd);
    
    return [
        { $match: {
            $and :[
                {created: {$gte: dateRangeQuery.dateStart, $lt: dateRangeQuery.dateEnd}},
                {offer: ObjectId(offerId)}
            ]
        }},
        { $sort : { created : -1} },
        { $group: {
            _id: {
                'type':  '$type'
            },
            'count': { '$sum': 1 }
        }}];

};


 

 
exports.list = function(req, res) {


    if(req.param('action') === 'filter'){

        exports.filter(req, res);

    }else{

        Offer.find().sort('-created').deepPopulate(['affiliation']).exec(function(err, offers) {    
            return res.jsonp(offers);
        });    
    }

    
};





exports.filter = function(req, res) {

    Offer.find().sort('-created')
        //.deepPopulate(['segmentation.dynamicSegmentation', 'affiliation'])
        .exec(function(err, offers) {

            
            console.log('offers', offers.length);


            //return res.jsonp(offers);
            //offers = offers.toObject();



            async.eachOfSeries(offers, function (offer, key, done) {

                /*var dateRange = stat.getDateRange(offer, req, res);
            

                var queryClicksGroupedByType = exports.getQueryClicksGroupedByType(
                    offer._id, dateRange.dateStart, dateRange.dateEnd);
                
                StatsClicks.aggregate(query, function(err, statsClicksGrouped) {
                        
                    var totalImpressions = 0;
                    var totalClicks = 0;
                    var totalRefusal = 0;
                    var totalAcceptance = 0;

                    for(var x=0; x<statsClicksGrouped.length; x++){

                        if(statsClicksGrouped[x]._id.type === 'refusal'){
                            totalRefusal += statsClicksGrouped[x].count;

                        }else if(statsClicksGrouped[x]._id.type === 'acceptance'){
                            totalAcceptance += statsClicksGrouped[x].count;
                        }

                        totalClicks += statsClicksGrouped[x].count;
                    }

                    offers[key].stats = {};

                    offers[key].stats.clicks = totalClicks;
                    offers[key].refusal =  Math.round((totalRefusal/totalClicks)*100);
                    offers[key].acceptance =  Math.round((totalAcceptance/totalClicks)*100);

                });*/

                console.log('');
                console.log('offer', offer.name);
                console.log('key', key);

                if(key === offers.length){
                    done();
                }

                //done();
                     
            }, function (err) {
              
              console.log(' ');console.log(' ');
              console.log('Well done :-)!');
              res.jsonp(offers); 

            });

    });
};





exports.listByAffiliationCode = function(req, res, next) {

    var affiliation = req.affiliation;

    if(req.param('user')){      
        exports.listSegmented(req, res, affiliation._id);
    }
};





exports.listSegmented = function(req, res, affId) {

        if(!req.param('user')){
            res.jsonp({message : 'User must be sent'});
            return null;
        }

        request({
            uri: 'http://localhost:3009/users/email/'+req.param('user'),
            method: 'GET',
            json: {languageOrigin : 'pt-BR'}
        }, function(error, response, user) {

            console.log('');console.log('');
            console.log('user', affId, user);


                Offer.find({
                    $and:[
                        {status:true},
                        {affiliation: ObjectId(affId)}
                    ]},{})
                    .sort('-created')
                    .deepPopulate(['segmentation.dynamicSegmentation', 'affiliation'])
                    .lean().exec(function(err, offers) {

                        console.log('');console.log('');
                        console.log('offers', offers);

                        if (err) {
                            
                            return res.status(400).send({
                                message: errorHandler.getErrorMessage(err.message)
                            });
                        
                        } else {

                            user.deviceAccess = (req.param('device')) ? req.param('device') : {};
                            var offersSegmented = Segmentation.getOfferSegmented(user, offers);

                            res.jsonp(exports.buildListOffersByType(offersSegmented));
                        }
                    });
        });
};
 


exports.buildListOffersByType = function(offers) {

    var offersByType = {

        dynamicSegmentation: [],
        sponsoring : [],
        survey : [],
        questionHall: [],
        balcony: []
    };

    var offersDyn = [];

    for (var i = 0; i < offers.length; i++) {

        if(offers[i].segmentation.dynamicSegmentation.length > 0){

            for (var x = 0; x < offers[i].segmentation.dynamicSegmentation.length; x++) {

                offersByType.dynamicSegmentation.push(
                    offers[i].segmentation.dynamicSegmentation[x]
                );    
            }               
        }
                                
        if(offers[i].isSponsoring){
            offersByType.sponsoring.push(offers[i]);
        }

        if(offers[i].isSurvey){
            offersByType.survey.push(offers[i]);
        }

        if(offers[i].isQuestionHall){
            offersByType.questionHall.push(offers[i]);
        }

        if(offers[i].isBalcony){
            offersByType.balcony.push(offers[i]);
        }
    }

 

    offersByType.dynamicSegmentation = 
        _.uniq(offersByType.dynamicSegmentation, function(item, key, _id) { 
            return item._id;
        });  




    for (var x = 0; x < offersByType.dynamicSegmentation.length; x++) {

        offersByType.dynamicSegmentation[x].relatedOffers = [];
        
        for (var y = 0; y < offers.length; y++) {
            if(offers[y].segmentation.dynamicSegmentation.length > 0){
                for (var z = 0; z < offers[y].segmentation.dynamicSegmentation.length; z++) {

                    if(offersByType.dynamicSegmentation[x]._id === offers[y].segmentation.dynamicSegmentation[z]._id){

                        offersByType.dynamicSegmentation[x].relatedOffers.push(offers[y]._id);
                    }    
                }               
            }
        }
    };

    return offersByType;
};





exports.create = function(req, res) {

    var offer = new Offer(req.body);


    offer.save(function(err) {
        
        if (err) {

            console.log('err', err);
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err.message)
            });

        } else {

            MyHallController.updateMyHall(offer);
            res.jsonp(offer);
        }
    });
};




exports.read = function(req, res) {
    res.jsonp(req.offer);
};





exports.update = function(req, res) {

    var offer = req.offer;

    offer = _.extend(offer , req.body);

    offer.save(function(err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err.message)
            });
        } else {

            //Offer.populate(offer, { path:"affiliation" }, 
            Offer.populate(offer, { path:"affiliationData" }, 
                function(err, offerPopulated) { 


                for(var x=0; x<offerPopulated.affiliationData.length; x++){
                   
                    MyHallController.updateMyHallByAffiliation
                        (offerPopulated, offerPopulated.affiliationData[x]);
                }
                
                res.jsonp(offerPopulated); 

            });
        }
    });
};





exports.delete = function(req, res) {

    var offer = req.offer;

    offer.remove(function(err) {
        
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err.message)
            });
        
        } else {

            offer.isSponsoring = false;
            offer.isSurvey = false;
            offer.isQuestionHall = false;
            offer.isBalcony = false;

            MyHallController.updateMyHall(offer);
            
            res.jsonp(offer);
        }
    }); 
};











exports.listByAffiliation = function(req, res, next, id) {

    if(req.param('user')){
        
        exports.listSegmented(req, res, id);
        return null;
    }


    Offer.find({affiliation: { $in : [ ObjectId(id)]}},{})
        .sort('-created')
        .deepPopulate(['segmentation.dynamicSegmentation', 'affiliation'])
        .exec(function(err, offers) {

            if (err) {
                return res.status(400).send({
                    message: errorHandler.getErrorMessage(err.message)
                });
            } else {
                res.jsonp(offers);
            }
        });
};







exports.offerByID = function(req, res, next, id) {

    Offer.findById(id)
        .deepPopulate(['segmentation.dynamicSegmentation', 'affiliation'])
        .exec(function(err, offer) {

        if (err) return next(err);
        if (! offer) return next(new Error('Failed to load Offer ' + id));
        req.offer = offer ;
        next();
    });
};















