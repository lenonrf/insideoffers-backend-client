'use strict';

module.exports = function(app) {

    var myhall = require('../../app/controllers/myhall');
    var affiliation = require('../../app/controllers/affiliation');
    var offer = require('../../app/controllers/offer');


    app.route('/myhall')
        .get(myhall.list)
        .post(myhall.create);

    app.route('/myhall/:myhallId')
        .get(myhall.read)
        .put(myhall.update)
        .delete(myhall.delete);

    app.param('myhallId', myhall.myHallByID);


    app.route('/myhall/affiliation/:affId')
        .get(myhall.read)
        .put(myhall.update)
	app.param('affId', myhall.listByAffiliation);


    app.route('/myhall/affiliation/:affIdMyhall/offer/:offerAffId')
        .get(myhall.read)
        .delete(myhall.deleteOfferByffiliation);
    
    app.param('affIdMyhall', affiliation.affiliationByID);
    app.param('offerAffId', offer.offerByID);

};
