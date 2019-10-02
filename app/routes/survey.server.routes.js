'use strict';

module.exports = function(app) {

var request = require('request');

    app.route('/survey_adzpm') 
        .get(function(req, res){

        var uri = 'https://adzpm.com/coreg/ws10/?name={nome}&email={email}&gender={sexo}&dob={nascimento}&zipcode={cep}';

        uri = uri.replace('{nome}', req.query.name)
                .replace('{sexo}', req.query.gender)
                .replace('{email}', req.query.email)
                .replace('{nascimento}', req.query.dob)
                .replace('{cep}', req.query.zipcode)
                .replace(new RegExp(' ', 'g'), '%20');

        request(uri, function (error, response, body) {

            if (!error && response.statusCode == 200) {
                console.log(response.statusCode,uri);
                res.json(200);

            }else{
                console.log(error,uri);
                res.json(500);
            }
        });

    });
};
