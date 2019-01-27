'use strict';


/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    errorHandler = require('./errors'),
    Affiliation = mongoose.model('Affiliation'),
    MyHall = mongoose.model('MyHall'),
    Offer = mongoose.model('Offer'),
    ObjectId = mongoose.Types.ObjectId,
    _ = require('lodash');



exports.create = function(req, res) {

    var affiliation = new Affiliation(req.body);

    console.log(req.body);

    affiliation.save(function(err) {

        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err.message)
            });
        } else {


            MyHall.create({affiliation: affiliation._id}, function(err) {
                if (err) {
                    return res.status(400).send({
                        message: errorHandler.getErrorMessage(err.message)
                    });

                } else {
                    res.jsonp(affiliation);
                }
            });


        }
    });
};




exports.read = function(req, res) {
    res.jsonp(req.affiliation);
};





exports.update = function(req, res) {

    var affiliation = req.affiliation;

    affiliation = _.extend(affiliation , req.body);

    affiliation.save(function(err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err.message)
            });
        } else {
            res.jsonp(affiliation);
        }
    });
};





exports.delete = function(req, res) {

    var affiliation = req.affiliation;

    MyHall.remove({ affiliation: affiliation._id }, function(err, myHallRemoved) {
        Offer.remove({ affiliation: affiliation._id }, function(err, offerRemoved) {

            affiliation.remove(function(err, affiliationRemoved) {

                if (err) {
                    return res.status(400).send({
                        message: errorHandler.getErrorMessage(err.message)
                    });
                } else {
                    res.jsonp(affiliation);
                }
            });
        });
    });

}; 



exports.deleteOffersFromMyHall = function (myhall) {
  
    var offers = exports.getOffersToDelete(myhall);

    for (var x = 0; x < offers.length; x++) {
        Offer.remove({_id : ObjectId(offers[x])},function() {});
    };  
};


exports.getOffersToDelete = function(myhall){

    var offers = [];

    if(!myhall){
        return offers;
    }

    if(myhall.sponsoring){
        for(var x=0; x<myhall.sponsoring.length; x++){
            offers.push(myhall.sponsoring[x].toString());
        }
    }

    if(myhall.survey){
        for(var x=0; x<myhall.survey.length; x++){
            offers.push(myhall.survey[x].toString());
        }
    }

    if(myhall.questionHall){
        for(var x=0; x<myhall.questionHall.length; x++){
            offers.push(myhall.questionHall[x].toString());
        }
    }

    if(myhall.balcony){
        for(var x=0; x<myhall.balcony.length; x++){
            offers.push(myhall.balcony[x].toString());
        }
    }

    return _.uniq(offers);
};






exports.list = function(req, res) {

    var limit = req.param('limit');

    Affiliation.find().sort('-created')
        .limit(limit)
        .exec(function(err, affiliations) {

            if (err) {
                return res.status(400).send({
                    message: errorHandler.getErrorMessage(err.message)
                });
            } else {
                res.jsonp(affiliations);
            }
        });
};




exports.affiliationByID = function(req, res, next, id) {

    Affiliation.findById(id).exec(function(err, affiliation) {

        if (err) return next(err);
        if (! affiliation) return next(new Error('Failed to load Affiliation ' + id));
        req.affiliation = affiliation ;
        next();
    });
};


exports.affiliationByCode = function(req, res, next, id) {

    Affiliation.findOne({code:id}).exec(function(err, affiliation) {

        if (err) return next(err);
        if (! affiliation) return next(new Error('Failed to load Affiliation ' + id));
        req.affiliation = affiliation ;
        next();
    });
};




