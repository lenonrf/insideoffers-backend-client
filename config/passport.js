'use strict';


var passport = require('passport')
    , LocalStrategy = require('passport-local').Strategy;

var User = require('../app/models/user');

module.exports = function() {



    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });




    /**
     * ----------------------------------------------
     * SIGNUP
     */
    passport.use('local-signup', new LocalStrategy({

            email : 'email',
            hashedPassword : 'password',
            passReqToCallback : true
        },
        function(req, email, password, done) {

            console.log('local-signup', email, user);


            process.nextTick(function() {

                User.findOne({ 'email' :  email }, function(err, user) {

                    if (err){ return done(err);}

                    if(user){

                        console.log('local-signup', email, user);

                        return done(null, false, req.flash('signupMessage', 'That email is already taken.'));

                    } else {

                        var newUser = new User();
                        newUser.email    = email;
                        newUser.password    = password;
                        newUser.hashedPassword = newUser.encryptPassword(password);



                        newUser.save(function(err) {
                            if (err) { throw err; }
                            return done(null, newUser);
                        });
                    }

                });

            });

        }));



    /**
     * ----------------------------------------------
     * LOGIN
     */
    passport.use('local', new LocalStrategy(
        function(username, password, done) {

            User.findOne({ email: username }, function(err, user) {

                if (err) { return done(err); }

                if (!user) {
                    return done(null, false, { message: 'Incorrect username.' });
                }

                if (!user.authenticate(password)) {
                    return done(null, false, { message: 'Incorrect password.' });
                }

                return done(null, user);
            });
        }
    ));


};
