'use strict';

module.exports = function(app) {

    var offer = require('../../app/controllers/offer');
    var affiliation = require('../../app/controllers/affiliation');


    app.route('/offer')
        .get(offer.list)
        .post(offer.create);

    app.route('/offer/:offerId')
        .get(offer.read)
        .put(offer.update)
        .delete(offer.delete);
    app.param('offerId', offer.offerByID);


    app.route('/offer/affiliation/:affiliationCode')
        .get(offer.listByAffiliationCode);
	app.param('affiliationCode', affiliation.affiliationByCode);		


    /*app.route('/offer/:offerIdStats/stats/impressions')
        .post(offer.addStatsImpression);
    app.param('offerIdStats', offer.offerByID);

    app.route('/offer/:offerIdStats/stats/clicks')
        .post(offer.addStatsClick);
    app.param('offerIdStats', offer.offerByID);
*/



    var mongoose = require('mongoose'),
    Affiliation = mongoose.model('Affiliation'),
    Offer = mongoose.model('Offer');


    var ObjectId = mongoose.Types.ObjectId;


    app.route('/updateOfferAffiliation') 
        .get(function(req, res){

            Offer.find()
                .deepPopulate('affiliation')
                .exec(function(err, offers) {


                    var affData = {};
                    var affURLItem = {};
                    var offerItem = {};
             
                    for (var x = 0; x < offers.length; x++) {

                        offerItem = offers[x];
                        offerItem.affiliationData = [];
                        
                        for (var y = 0; y < offers[x].affiliation.length; y++) {

                            affData = {

                                affiliation: offerItem.affiliation[y]._id,

                                delivery: [],
                                                             
                                isBalcony: offerItem.isBalcony,
                                isQuestionHall: offerItem.isQuestionHall,
                                isSurvey: offerItem.isSurvey,
                                isSponsoring: offerItem.isSponsoring
                            };

                            if(affData.isSurvey){

                                for (var index = 0; index < offerItem.delivery.survey.affiliationURL.length; index++) {

                                    affURLItem = offerItem.delivery.survey.affiliationURL[index];

                                    if(affURLItem.affiliation.toString() === affData.affiliation.toString()){

                                        affData.delivery.push({

                                            isShowAnswerList: false,

                                            birthDate: {
                                                isBirthDate: offerItem.delivery.survey.birthDate.isBirthDate,
                                                mask: offerItem.delivery.survey.birthDate.mask
                                            },
                                            gender: {
                                                isGender: offerItem.delivery.survey.gender.isGender,
                                                valueFemale: offerItem.delivery.survey.gender.valueFemale,
                                                valueMale: offerItem.delivery.survey.gender.valueMale
                                            },

                                            urlType: affURLItem.type,
                                            url: affURLItem.url,

                                            offerType: 'survey',
                                            isUploadImage: offerItem.delivery.survey.isUploadImage,
                                            image: offerItem.delivery.survey.smallImage
                                        });

                                    }
                                } 
                            }

                            if(affData.isSponsoring){

                                for (var index = 0; index < offerItem.delivery.sponsoring.affiliationURL.length; index++) {

                                    affURLItem = offerItem.delivery.sponsoring.affiliationURL[index];

                                    if(affURLItem.affiliation.toString() === affData.affiliation.toString()){

                                        affData.delivery.push({

                                            isShowAnswerList: false,

                                            birthDate: {
                                                isBirthDate: offerItem.delivery.sponsoring.birthDate.isBirthDate,
                                                mask: offerItem.delivery.sponsoring.birthDate.mask
                                            },
                                            gender: {
                                                isGender: offerItem.delivery.sponsoring.gender.isGender,
                                                valueFemale: offerItem.delivery.sponsoring.gender.valueFemale,
                                                valueMale: offerItem.delivery.sponsoring.gender.valueMale
                                            },

                                            urlType: affURLItem.type,
                                            url: affURLItem.url,
                                            
                                            offerType: 'sponsoring',
                                            isUploadImage: offerItem.delivery.sponsoring.isUploadImage,
                                            image: offerItem.delivery.sponsoring.largeImage
                                        });

                                    }
                                }
                            }


                            if(affData.isQuestionHall){

                                for (var index = 0; index < offerItem.delivery.questionHall.affiliationURL.length; index++) {

                                    affURLItem = offerItem.delivery.questionHall.affiliationURL[index];

                                    if(affURLItem.affiliation.toString() === affData.affiliation.toString()){

                                        affData.delivery.push({

                                            isShowAnswerList: offerItem.delivery.questionHall.isShowAnswerList,

                                            birthDate: {
                                                isBirthDate: offerItem.delivery.questionHall.birthDate.isBirthDate,
                                                mask: offerItem.delivery.questionHall.birthDate.mask
                                            },
                                            gender: {
                                                isGender: offerItem.delivery.questionHall.gender.isGender,
                                                valueFemale: offerItem.delivery.questionHall.gender.valueFemale,
                                                valueMale: offerItem.delivery.questionHall.gender.valueMale
                                            },

                                            urlType: affURLItem.type,
                                            url: affURLItem.url,
                                            
                                            offerType: 'questionHall',
                                            isUploadImage: offerItem.delivery.questionHall.isUploadImage,
                                            image: offerItem.delivery.questionHall.largeImage
                                        });

                                    }
                                }
                            }



                            if(affData.isBalcony){

                                for (var index = 0; index < offerItem.delivery.balcony.affiliationURL.length; index++) {

                                    affURLItem = offerItem.delivery.balcony.affiliationURL[index];

                                    if(affURLItem.affiliation.toString() === affData.affiliation.toString()){

                                        affData.delivery.push({

                                            isShowAnswerList: false,

                                            birthDate: {
                                                isBirthDate: offerItem.delivery.balcony.birthDate.isBirthDate,
                                                mask: offerItem.delivery.balcony.birthDate.mask
                                            },
                                            gender: {
                                                isGender: offerItem.delivery.balcony.gender.isGender,
                                                valueFemale: offerItem.delivery.balcony.gender.valueFemale,
                                                valueMale: offerItem.delivery.balcony.gender.valueMale
                                            },

                                            urlType: affURLItem.type,
                                            url: affURLItem.url,
                                            
                                            offerType: 'balcony',
                                            isUploadImage: offerItem.delivery.balcony.isUploadImage,
                                            image: offerItem.delivery.balcony.largeImage
                                        });

                                    }
                                }
                            }


                            offers[x].affiliationData.push(affData);

                        }
                        

                        var query = {'_id': offers[x]._id};
                        
                        Offer.findOneAndUpdate(query, offers[x], {upsert:true}, function(err, offer){
                            if (err) return res.send(500, { error: err });                           
                        });

                    }

                    //res.jsonp(offers);

                });
        });


 	
};
