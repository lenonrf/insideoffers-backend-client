
'use strict';


var affiliation = require('../../app/controllers/affiliation');
var affiliationStats = require('../../app/controllers/affiliationStats');


module.exports = function(app) {


    app.route('/affiliation/:idAffStats/stats/origintraffic')
        .get(affiliationStats.getConversions);
    app.param('idAffStats', affiliation.affiliationByID);

};


