'use strict';


/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    errorHandler = require('./errors'),
    Questions = mongoose.model('Questions'),
    _ = require('lodash');



exports.create = function(req, res) {

    var questions = new Questions(req.body);

    questions.save(function(err) {
        if (err) {

            console.log('err', err);

            return res.status(400).send({
                message: errorHandler.getErrorMessage(err.message)
            });
        } else {
            res.jsonp(questions);
        }
    });
};




exports.read = function(req, res) {
    res.jsonp(req.questions);
};





exports.update = function(req, res) {

    var questions = req.questions;

    questions = _.extend(questions , req.body);

    questions.save(function(err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err.message)
            });
        } else {
            res.jsonp(questions);
        }
    });
};





exports.delete = function(req, res) {

    var questions = req.questions;

    questions.remove(function(err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err.message)
            });
        } else {
            res.jsonp(questions);
        }
    });
};






exports.list = function(req, res) {

    var limit = req.param('limit');

    Questions.find().sort('-created')
        .limit(limit)
        .exec(function(err, questionss) {

            if (err) {
                return res.status(400).send({
                    message: errorHandler.getErrorMessage(err.message)
                });
            } else {
                res.jsonp(questionss);
            }
        });
};




exports.questionsByID = function(req, res, next, id) {

    Questions.findById(id).exec(function(err, questions) {

        if (err) return next(err);
        if (! questions) return next(new Error('Failed to load Questions ' + id));
        req.questions = questions ;
        next();
    });
};




