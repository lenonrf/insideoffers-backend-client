'use strict';

var passport = require('passport');
var authorization = require('../../app/controllers/authorization');
var user = require('../../app/controllers/users');

module.exports = function(app) {


    app.post('/login', passport.authenticate('local'), function(req, res) {
    //app.post('/login', function(req, res) {

        var token = authorization.getLoginSucessReturn(req, res);

        res.json({
            userId: req.user._id,
            token: token
        });
    });

    app.route('/signup')
        .post(passport.authenticate('local-signup'));

    app.route('/login/create')
        .post(user.create);


};
