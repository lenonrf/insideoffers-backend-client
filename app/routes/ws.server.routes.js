'use strict';

module.exports = function(app) {

    var wsClient = require('../../app/controllers/ws');

    app.route('/wsclient')
        .post(wsClient.execute);




	var KeyCDN = require('keycdn');
	var keycdn = new KeyCDN('sk_prod_OWY3YzcwODg5NGRhMTQ1ODQw');	

        app.route('/upload')
        	.get(function(req, res){

        		keycdn.get('zones/10179.json', function(err, results) {
				    if (err) {
				        console.trace(err);
				        return;
				    }
				    res.jsonp(results);
				});

        	});

};
