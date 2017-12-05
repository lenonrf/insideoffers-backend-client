
'use strict';

module.exports = function(app) {

    var stat = require('../../app/controllers/stat');
    var offer = require('../../app/controllers/offer');

    app.route('/offer/:offerIdStats/stats')
        .get(stat.getOfferStats);
    app.param('offerIdStats', offer.offerByID);


    app.route('/offer/:offerIdStats/stats/offertype')
        .get(stat.getStatsFromOfferType);
    app.param('offerIdStats', offer.offerByID);

    app.route('/offer/:offerIdStats/stats/trafficsource')
        .get(stat.getStatsFromTraficSource);
    app.param('offerIdStats', offer.offerByID);



    app.route('/offer/:offerIdStats/stats/impressions')
        .get(stat.getStatsImpressionByOffer)
        .post(stat.addStatsImpression);
    app.param('offerIdStats', offer.offerByID);

    app.route('/offer/:offerIdStats/stats/clicks')
        .get(stat.getStatsClicksByOffer)
        .post(stat.addStatsClick);
    app.param('offerIdStats', offer.offerByID);


    app.route('/offer/:offerIdStatsResume/stats/resume')
        .get(stat.buildStatsFromOfferResume)
    app.param('offerIdStatsResume', offer.offerByID);



    app.route('/offer/stats/resume')
        .post(stat.executeOfferStatsResume);



};
