'use strict';


/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    errorHandler = require('./errors'),
    Segmentation = mongoose.model('Segmentation'),
    _ = require('lodash');




exports.buildDynamicSegmentation = function(myhall){
    

    var offers = _.unionBy(myhall.sponsoring, myhall.survey, 
        myhall.questionHall, myhall.balcony,'_id');

    var dynamicSegmentation = [];

    _.forEach(offers, function(offerItem, key) {

        if(offerItem.status){
            _.forEach(offerItem.segmentation.dynamicSegmentation, function(dynamicItem, key) {
                dynamicSegmentation.push(dynamicItem);
            }); 
        }

                           
    });

                       
    dynamicSegmentation = _.unionBy(
         _.flattenDeep(dynamicSegmentation),'title');

    _.forEach(dynamicSegmentation, function(dynamicItem, index) {

        dynamicItem.offers = [];

        _.forEach(offers, function(offerItem, key) {
            _.forEach(offerItem.segmentation.dynamicSegmentation, function(dynamicSegmentationItem, key) {

                if(_.isEqual(dynamicSegmentationItem._id, dynamicItem._id)){
                    dynamicItem.offers.push(offerItem._id);
                }
            });
        });
    });

    return dynamicSegmentation;

};




exports.getDynimicSegmentation = function(offersList) {

    var dynamicSegmentation = [];

    _.forEach(offersList, function(offerItem, key) {

        if(offerItem.status){
            _.forEach(offerItem.segmentation.dynamicSegmentation, function(dynamicItem, key) {
                dynamicSegmentation.push(dynamicItem);
            }); 
        }                            
    });
               
    dynamicSegmentation = _.unionBy(
        _.flattenDeep(dynamicSegmentation),'title');

    return dynamicSegmentation;
};







exports.isOfferAvailable = function(user, offer) {

    if(_.isEmpty(user)){
        return true;
    }

    if(_.isEmpty(offer.segmentation)){
        return true;
    }

    var isAvailableToUser = exports.isAvailableToUser(user, offer.segmentation);
                
    if (isAvailableToUser) {
        return true;
    }else{
        return false;        
    }

 
    
};



exports.getOfferSegmented = function(user, offers, device) {

    if(_.isEmpty(user)){
        return offers;
    }

    if(offers.length === 0){
        return [];
    }

    var domainsSegmentated = []

    user.deviceAccess = device;
                         

    for(var x=0; x<offers.length; x++){

        if(offers[x].status){
            if(offers[x].segmentation) {

                var isAvailableToUser = exports.isAvailableToUser(user, offers[x].segmentation);
                
                if (isAvailableToUser) {
                    domainsSegmentated.push(offers[x]);
                }

            }else{
                domainsSegmentated.push(offers[x]);
            }          
        }


    }
 
    return domainsSegmentated;
};





/**
 * Build a object of User segmentation to compare
 */
exports.buildUserSegmentated = function(user){

    var dateBirth = new Date(user.birthDate);
    var currentDate = new Date();

    return {

        age : (currentDate.getFullYear() - dateBirth.getFullYear()),
        device : user.deviceAccess,
        gender : user.gender,
        region : user.cellphone.substring(0, 2),
        email : user.email
    };
};










exports.isAvailableToUser = function(user, segmentation) {

    //console.log(' ');console.log(' ');
    //console.log('segmentation', segmentation);
    //console.log('device', exports.isAvailableDevice(userSegmentated, segmentation));
    //console.log('gender', exports.isAvailableGender(userSegmentated, segmentation));
    //console.log('isAvailableAge', exports.isAvailableAge(userSegmentated, segmentation));
    //console.log('isAvailableRegion', exports.isAvailableRegion(userSegmentated, segmentation));
    //console.log('isAvailableUserDomain', exports.isAvailableUserDomain(userSegmentated, segmentation));

    var userSegmentated = exports.buildUserSegmentated(user);

    if(!exports.isAvailableDevice(userSegmentated, segmentation)){
        return false;
    }

    if(!exports.isAvailableGender(userSegmentated, segmentation)){
        return false;
    }

    if(!exports.isAvailableAge(userSegmentated, segmentation)){
        return false;
    }

    if(!exports.isAvailableRegion(userSegmentated, segmentation)){
        return false;
    }


    if(!exports.isAvailableUserDomain(userSegmentated, segmentation)){
        return false;
    }


    return true;
};




exports.isAvailableDevice = function(userSegmentated, segmentation) {

    if(segmentation.isMobile || segmentation.isDesktop){
        
        switch(userSegmentated.device.toLowerCase()){

            case 'mobile':
                return segmentation.isMobile;
                break;

            case 'desktop':
                return segmentation.isDesktop;
                break;
        }
    
    }else{
        return true;
    }
};




exports.isAvailableGender = function(userSegmentated, segmentation) {

    if(segmentation.isFemale || segmentation.isMale){
        
        switch(userSegmentated.gender.toLowerCase()){

            case 'f':
                return segmentation.isFemale;
                break;

            case 'm':
                return segmentation.isMale;
                break;
        }
    
    }else{
        return true;
    }
};





exports.isAvailableUserDomain = function(userSegmentated, segmentation) {

    if(segmentation.forbiddenDomains.length != 0) {

        var userDomainsFilter = segmentation.forbiddenDomains;

        for (var x = 0; x < userDomainsFilter.length; x++) {
            if(userSegmentated.email.indexOf(userDomainsFilter[x]) > -1){
                return false;
            }
        }
    }

    return true;
};





exports.isAvailableAge = function(userSegmentated, segmentation) {

    var age = parseInt(userSegmentated.age);
    var lessThan = parseInt(segmentation.age.lessThan);
    var moreThan = parseInt(segmentation.age.moreThan);

    if(lessThan === 0 && moreThan === 0){
        return true;
    }

    if((lessThan === 0) && (moreThan > 0)){
        //console.log('moreThan', (age >= moreThan));
        return (age >= moreThan);
    }

    if((moreThan === 0) && (lessThan > 0)){
        //console.log('lessThan', (age <= lessThan));
        return (age <= lessThan);
    }

    if((moreThan > 0) && (lessThan > 0)){
        //console.log('between', ((age >= moreThan) && (age <= lessThan)));
        return ( (age >= moreThan) && (age <= lessThan));
    }
        
};




exports.isAvailableRegion = function(userSegmentated, segmentation) {

    var userRegion = userSegmentated.region;

    if(segmentation.dddRegion.length == 0){
        return true;
    }

    return (segmentation.dddRegion.indexOf(userRegion) > -1);
};




exports.create = function(req, res) {

    var segmentation = new Segmentation(req.body);

    segmentation.save(function(err) {
        if (err) {

            console.log('err', err);

            return res.status(400).send({
                message: errorHandler.getErrorMessage(err.message)
            });
        } else {
            res.jsonp(segmentation);
        }
    });
};




exports.read = function(req, res) {
    res.jsonp(req.segmentation);
};





exports.update = function(req, res) {

    var segmentation = req.segmentation;

    segmentation = _.extend(segmentation , req.body);

    segmentation.save(function(err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err.message)
            });
        } else {
            res.jsonp(segmentation);
        }
    });
};





exports.delete = function(req, res) {

    var segmentation = req.segmentation;

    segmentation.remove(function(err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err.message)
            });
        } else {
            res.jsonp(segmentation);
        }
    });
};






exports.list = function(req, res) {

    var filterCategory = req.param('category');


    if ( (typeof filterCategory != 'undefined') && (filterCategory != 0)) {
        exports.filterByCategory(req, res, filterCategory);

    }else{

        Segmentation.find().sort('-created')
            .populate('category', 'name').exec(function(err, segmentations) {

                if (err) {
                    return res.status(400).send({
                        message: errorHandler.getErrorMessage(err.message)
                    });
                } else {
                    res.jsonp(segmentations);
                }
            });
    }

};




exports.segmentationByID = function(req, res, next, id) {

    Segmentation.findById(id).exec(function(err, segmentation) {

        if (err) return next(err);
        if (! segmentation) return next(new Error('Failed to load Segmentation ' + id));
        req.segmentation = segmentation ;
        next();
    });
};




