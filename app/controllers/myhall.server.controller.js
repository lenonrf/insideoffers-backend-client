'use strict';


/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    errorHandler = require('./errors'),
    Segmentation = require('./segmentation'),
    MyHall = mongoose.model('MyHall'),
    Offer = mongoose.model('Offer'),
    Affiliation = mongoose.model('Affiliation'),
    request = require('request'),
    _ = require('lodash');

var ObjectId = mongoose.Types.ObjectId;




exports.create = function(req, res) {

    var myHall = new MyHall(req.body);

    myHall.save(function(err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err.message)
            });
        } else {
            res.jsonp(myHall);
        }
    });
};




exports.read = function(req, res) {
    res.jsonp(req.myHall);
};








exports.deleteOfferByffiliation = function(req, res) {

    var affiliation = req.affiliation;
    var offer = req.offer;

    console.log('offer', offer.name);
    console.log('affiliation', affiliation.name);

        MyHall.findOneAndUpdate({
                    affiliation: ObjectId(affiliation._id)
                }, 
                {$pull: {sponsoring: ObjectId(offer._id) }},  
                
                function(err, myhall){
                    
                    if(err){console.log('err', err);}

                }); 
   

        MyHall.findOneAndUpdate({
                    affiliation: ObjectId(affiliation._id)
                }, 
                {$pull: {survey: ObjectId(offer._id) }},  
                
                function(err, myhall){
                    
                    if(err){console.log('err', err);}

                }); 
   

        MyHall.findOneAndUpdate({
                    affiliation: ObjectId(affiliation._id)
                }, 
                {$pull: {questionHall: ObjectId(offer._id) }},  
                
                function(err, myhall){
                    
                    if(err){console.log('err', err);}

                }); 
   


        MyHall.findOneAndUpdate({
                    affiliation: ObjectId(affiliation._id)
                }, 
                {$pull: {balcony: ObjectId(offer._id) }},  
                
                function(err, myhall){
                    
                    if(err){console.log('err', err);}

                }); 
      


  };




exports.delete = function(req, res) {

    var myHall = req.myHall;

    myHall.remove(function(err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err.message)
            });
        } else {
            res.jsonp(myHall);
        }
    });
};




exports.deleteByAffiliation = function(req, res, next, id) {

    MyHall.remove({affiliation: id}, function(err) {
        
        if (err) {
    
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err.message)
            });
        }
    });

};




exports.update = function(req, res) {

    var myHall = req.body;

    MyHall.update(myHall, function(err) {

        if (err) {

            return res.status(400).send({
                message: errorHandler.getErrorMessage(err.message)
            });

        } else {
            res.jsonp(myHall);
        }
    });
};





exports.updateMyHallByAffiliation = function(offer, affiliationDataItem){

    var offerTypeStatus = {
        isSponsoring : affiliationDataItem.isSponsoring,
        isSurvey : affiliationDataItem.isSurvey,
        isQuestionHall : affiliationDataItem.isQuestionHall,
        isBalcony : affiliationDataItem.isBalcony
    };


    MyHall.findOne({affiliation: ObjectId(affiliationDataItem.affiliation)},{})
            .deepPopulate(['affiliation'])
            .exec(function(err, myhallItem) {

                console.log('');
                console.log('affiliationId', affiliationDataItem.affiliation);
                console.log('myhallItem', myhallItem);

            MyHall.findOneAndUpdate({
                    affiliation: ObjectId(myhallItem.affiliation._id)
                }, 
                {$set: exports.getOfferUpdated(myhallItem, offer, offerTypeStatus)}, 
                {new: true}, 
                
                function(err, myhall){
                    
                    if(err){console.log('err', err);}

                    console.log('');console.log('');
                    console.log('[UPDATE][MYHALL]', myhall.affiliation);
                    console.log('SPONSORING    |',  myhall.sponsoring.length);
                    console.log('SURVEY        |',  myhall.survey.length);
                    console.log('QUESTION HALL |',  myhall.questionHall.length);
                    console.log('BALCONY       |',  myhall.balcony.length);
                    console.log('');

                }); 
        });

};



exports.updateMyHall = function(offer){

    console.log('');
    console.log('offer.affiliationData', offer.affiliationData);

    var offerTypeStatus = {};

    for(var x=0; x<offer.affiliationData.length; x++){


        offerTypeStatus.isSponsoring = offer.affiliationData[x].isSponsoring;
        offerTypeStatus.isSurvey = offer.affiliationData[x].isSurvey;
        offerTypeStatus.isQuestionHall = offer.affiliationData[x].isQuestionHall;
        offerTypeStatus.isBalcony = offer.affiliationData[x].isBalcony;

        //var affId = (offer.affiliationData[x].affiliation[x]._id) ?  
            //offer.affiliation[x]._id : offer.affiliation[x]; 

        var affId = offer.affiliationData[x].affiliation;


        //console.log('');
        //console.log('affId', affId);


        MyHall.findOne({affiliation: ObjectId(affId)},{})
            .deepPopulate(['affiliation'])
            .exec(function(err, myhallItem) {


            MyHall.findOneAndUpdate( {affiliation: ObjectId(myhallItem._id)}, 
                {$set: exports.getOfferUpdated(myhallItem, offer, offerTypeStatus)}, 
                {new: true}, 
                
                function(err, myhall){
                    
                    if(err){console.log('err', err);}

                    //console.log('');console.log('');
                    //console.log('[UPDATE][MYHALL]', myhall.affiliation);
                    //console.log('SPONSORING    |', myhall.sponsoring.length);
                    //console.log('SURVEY        |', myhall.survey.length);
                    //console.log('QUESTION HALL |', myhall.questionHall.length);
                    //console.log('BALCONY       |', myhall.balcony.length);
                    //console.log('');

                }); 
        });



    }
    
};




exports.getOfferUpdated = function (myhall, offer, offerTypeStatus){

    var obj = {};

    if(offerTypeStatus.isSponsoring){
        obj.sponsoring = exports.insertIfExistOffer(myhall, offer._id, 'sponsoring');
    }else{
        obj.sponsoring = exports.deleteIfExistOffer(myhall, offer._id, 'sponsoring');
    }

    if(offerTypeStatus.isSurvey){
        obj.survey = exports.insertIfExistOffer(myhall, offer._id, 'survey');
    }else{
        obj.survey  = exports.deleteIfExistOffer(myhall, offer._id, 'survey');
    }

    if(offerTypeStatus.isQuestionHall){
        obj.questionHall = exports.insertIfExistOffer(myhall, offer._id, 'questionHall');
    }else{
        obj.questionHall = exports.deleteIfExistOffer(myhall, offer._id, 'questionHall');
    }

    if(offerTypeStatus.isBalcony){
        obj.balcony = exports.insertIfExistOffer(myhall, offer._id, 'balcony');
    }else{
        obj.balcony = exports.deleteIfExistOffer(myhall, offer._id, 'balcony');
    }

    return obj;

};




exports.insertIfExistOffer = function (myhall, offerId, offerType){

    if(myhall[offerType]){

        if(myhall[offerType].indexOf(offerId) === -1){
            myhall[offerType].push(offerId);
        }

    }else{

        myhall[offerType] = [];
        myhall[offerType].push(offerId);
    }

    return myhall[offerType] ;
};


exports.deleteIfExistOffer = function (myhall, offerId, offerType){

    if(myhall[offerType]){

        if(myhall[offerType].indexOf(offerId) > -1){

            myhall[offerType].splice(
                myhall[offerType].indexOf(offerId), 1);
        }
    }

    return myhall[offerType] ;
};









exports.list = function(req, res) {

    if(req.params.affcode){
        exports.filterByAffiliationCode(req, res);
        return null;
    }

    var limit = req.params.limit;

    MyHall.find().sort('-created')
        .limit(limit)
        .deepPopulate(['affiliation', 'sponsoring', 'survey', 'questionHall', 'balcony'])
        .exec(function(err, myHalls) {

            if (err) {
                return res.status(400).send({
                    message: errorHandler.getErrorMessage(err.message)
                });
            } else {
                res.jsonp(myHalls);
            }
        });
};



exports.myHallByID = function(req, res, next, id) {

    MyHall.findById(id).exec(function(err, myHall) {

        if (err) return next(err);
        if (! myHall) return next(new Error('Failed to load MyHall ' + id));
        req.myHall = myHall ;
        next();
    });
};







exports.listByAffiliation = function(req, res, next, id) {

    MyHall.findOne({affiliation: ObjectId(id)},{})
        .deepPopulate([
                'affiliation',
                'sponsoring.segmentation.dynamicSegmentation', 
                'survey.segmentation.dynamicSegmentation', 
                'questionHall.segmentation.dynamicSegmentation', 
                'balcony.segmentation.dynamicSegmentation'])
        .exec(function(err, myhall) {

            myhall = myhall.toObject();

            myhall.sponsoring = _.filter( myhall.sponsoring, function(o) { return o.status === true; });
            myhall.survey = _.filter( myhall.survey, function(o) { return o.status === true; });
            myhall.questionHall = _.filter( myhall.questionHall, function(o) { return o.status === true; });
            myhall.balcony = _.filter( myhall.balcony, function(o) { return o.status === true; });

            var offersList = _.unionBy(myhall.sponsoring, myhall.survey, 
                                myhall.questionHall, myhall.balcony,'_id');

            myhall.dynamicSegmentation = Segmentation.getDynimicSegmentation(offersList);

            if (err) {
                return res.status(400).send({
                    message: errorHandler.getErrorMessage(err.message)
                });
            } else {
                req.myHall = myhall;
                next();
            }
        });
};








exports.filterByAffiliationCode = function(req, res) {

    Affiliation.findOne({code: req.params.affcode}).exec(function(err, affiliation) {

        if(!affiliation){
            return res.jsonp({message : 'There is no affiliation for this code'});
        }      

        affiliation = affiliation.toObject();           

        MyHall.findOne({affiliation: ObjectId(affiliation._id)},{})
            .deepPopulate([
                'sponsoring.segmentation.dynamicSegmentation', 
                'survey.segmentation.dynamicSegmentation', 
                'questionHall.segmentation.dynamicSegmentation', 
                'balcony.segmentation.dynamicSegmentation'])
            .exec(function(err, myhall) {

                myhall = myhall.toObject();
                        
                request({ 
                    uri: 'http://localhost:3009/users/email/'+req.param('user'),
                    method: 'GET',
                    json: {languageOrigin : 'pt-BR'}
                }, function(error, response, user) {

                    if(!_.isEmpty(user)){
                        user.deviceAccess = {};  
                        user.deviceAccess = (req.param('device')) ? req.param('device') : {};    
                    }                                         

                    res.jsonp(
                        exports.buildMyHall(user, myhall, affiliation)
                    );

                });
            });
    });
};









exports.buildMyHall = function(user, myhall, affiliation){

    return {

        dynamicSegmentation : Segmentation.buildDynamicSegmentation(myhall),

        sponsoring   : exports.buildOffers('sponsoring', affiliation, user, myhall.sponsoring),
        survey       : exports.buildOffers('survey', affiliation, user, myhall.survey),
        questionHall : exports.buildOffers('questionHall', affiliation, user, myhall.questionHall),
        balcony      : exports.buildOffers('balcony', affiliation, user, myhall.balcony)

    };
};





exports.buildOffers = function(offerType, affiliation, user, offerTypeList){

    if(offerTypeList.length === 0){
        return [];
    }

    var offers = [];

    _.forEach(offerTypeList, function(offerItem, key) {

        if(Segmentation.isOfferAvailable(user, offerItem)){

            offers.push({

                _id: offerItem._id,
                status: offerItem.status,
                name: offerItem.name,
                segmentation: offerItem.segmentation,
                stats: offerItem.stats,
                mainQuestion: offerItem.mainQuestion,
                delivery: exports.buildDelivery(offerItem, offerType, affiliation._id),
                links: exports.buildOfferLinks(offerItem, affiliation)
            });
        }
    });

    return offers;
};







exports.buildDelivery = function(offerItem, offerType, affiliationId) {

    var indexAff = _.findIndex(offerItem.affiliationData, 
        function(o) { return o.affiliation.toString() == affiliationId; });

    if(indexAff > -1){

        var deliveryItem = {};

        for (var i = 0; i < offerItem.affiliationData[indexAff].delivery.length; i++) {
            
            deliveryItem = offerItem.affiliationData[indexAff].delivery[i];

            if(deliveryItem.offerType === offerType){

                return {

                    type : deliveryItem.urlType,
                    targetBlankUrl : deliveryItem.url,
                    wsUrl : deliveryItem.url,
                    isUploadImage: deliveryItem.isUploadImage,
                    smallImage: deliveryItem.image,
                    largeImage: deliveryItem.image,
                    birthDate: deliveryItem.birthDate,
                    gender: deliveryItem.gender
                };
            }
        }
    
    }else{

        return
    }
};







exports.buildOfferLinks = function(offerItem, affiliation){

    var URI = 'http://yhall.the-ybox.tech/api/offer/'+offerItem._id;

    return {

        addClick: {
                
            acceptance: {
                method: 'POST',
                link: URI+'/stats/clicks?type=acceptance&affcode='+affiliation.code
            },

            refusal: {
                method: 'POST',
                link: URI+'/stats/clicks?type=refusal&affcode='+affiliation.code
            }
        },

        addImpresssion: {
            method: 'POST',
            link: URI+'/stats/impressions?affcode='+affiliation.code
        }, 

        getOffer:{
            method: 'GET',
            link: URI

        }

    };                            
};












exports.buildAffiliationDeliveryURL = function(myhallOfferTypeList, offerType, affiliationId) {

    for(var x=0; x<myhallOfferTypeList.length; x++){

        if(myhallOfferTypeList[x].delivery[offerType].affiliationURL.length > 0){

            var indexAffiliationURL = 
                _.findIndex(myhallOfferTypeList[x].delivery[offerType].affiliationURL, 
                    function(o) { 

                        //console.log('');console.log('');console.log('');console.log('');
                        //console.log(offerType, myhallOfferTypeList[x]);
                        //console.log('o.affiliation', o.affiliation, affiliationId);
                        return o.affiliation.toString() == affiliationId; }
                );


            if(indexAffiliationURL > -1){

                myhallOfferTypeList[x].delivery[offerType].type = 
                    myhallOfferTypeList[x].delivery[offerType].affiliationURL[indexAffiliationURL].type;


                switch(myhallOfferTypeList[x].delivery[offerType].affiliationURL[indexAffiliationURL].type){

                    case 'ws':
                        myhallOfferTypeList[x].delivery[offerType].wsUrl = 
                            myhallOfferTypeList[x].delivery[offerType].affiliationURL[indexAffiliationURL].url;

                    break;

                    case 'tb':
                        myhallOfferTypeList[x].delivery[offerType].targetBlankUrl = 
                            myhallOfferTypeList[x].delivery[offerType].affiliationURL[indexAffiliationURL].url;
                    break;
                }
            }
        }
    }

    return myhallOfferTypeList;
    
};




