'user strict';

var mongoose = require('mongoose'),
    request = require('request'), 
    WsURIBuilder = require('./WSURIBuilder'),
    WsClientItem = mongoose.model('WsClientItem');


exports.execute = function(req, res){

    var offer = req.body.offer;
    var user = req.body.user;
    var offerType = req.body.type;

    if((!exports.isWSOfferType(offerType, offer)) && (offerType !== 'sponsor')){
        res.json(200);
        return null;
    }

    var uri = WsURIBuilder.build(offerType, offer, user);
    exports.executeURI(uri, offer, user, req, res);
 
};


exports.isWSOfferType = function(offerType, offer){

    switch(offerType){

        case 'sponsor':
            return (offer.delivery.sponsoring.type === 'ws');

        case 'survey':
            return (offer.delivery.survey.type === 'ws');

        case 'questionHall':
            return (offer.delivery.questionHall.type === 'ws');

        case 'balcony':
            return (offer.delivery.balcony.type === 'ws');
    }
};



exports.executeURI = function(uri, offer, user, req, res){
    
    request(uri, function (error, response, body) {

        if (!error && response.statusCode == 200) {

            console.log('');console.log('');
            console.log('[WSCLIENT]','['+offer.name+']','['+user.email+']', '[SUCCESS]','[URI]', uri);

            exports.createItem(uri, offer, user, body, true, res);
            res.json(200);

        }else{

            console.log('');console.log('');
            console.log('[WSCLIENT]','['+offer.name+']','['+user.email+']', '[ERROR]', error, '[URI]', uri);

            exports.createItem(uri, offer, user, body, false, res);
            res.json(500);
        }
    });
};





exports.getCurrentDateRange = function(){

    var today = new Date();
    today.setHours(0,0,0,0);

    var tomorow = new Date(today);
    tomorow.setDate(today.getDate()+1);

    return [today, tomorow]
};






exports.createItem = function(uri, offer, user, reason, status, res){


        data = {
            offer : offer._id,
            user : user._id,
            reason : reason,
            uri: uri,
            status : status,
            languageOrigin : user.languageOrigin
        };

        WsClientItem(data).save();

};



