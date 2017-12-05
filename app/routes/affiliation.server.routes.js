'use strict';

module.exports = function(app) {

    var affiliation = require('../../app/controllers/affiliation');

    app.route('/affiliation')
        .get(affiliation.list)
        .post(affiliation.create);

    app.route('/affiliation/:affiliationDomainId')
        .get(affiliation.read)
        .put(affiliation.update)
        .delete(affiliation.delete);

    app.param('affiliationDomainId', affiliation.affiliationByID);




};
