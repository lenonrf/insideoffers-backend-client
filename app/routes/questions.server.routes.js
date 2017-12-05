'use strict';

module.exports = function(app) {

    var questions = require('../../app/controllers/questions');

    app.route('/questions')
        .get(questions.list)
        .post(questions.create);

    app.route('/questions/:questionsId')
        .get(questions.read)
        .put(questions.update)
        .delete(questions.delete);

    app.param('questionsId', questions.questionsByID);
 



};
