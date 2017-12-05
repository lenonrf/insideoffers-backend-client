'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;


var QuestionsSchema = new Schema({

    title: {
        type: String, default: ''
    },

    smallImage: {
        type: String, default: ''
    },

    description: {
        type: String, default: ''
    },

    answerList: [
        {
            action: {

                textInput:{
                    type: String,  default: ''
                },

                fieldTag:{
                    type: String,  default: ''
                },

                field:{
                    type: String,  default: ''
                },

                textConfirmation:{
                    type: String,  default: ''
                }
            },

            answer: {
                type: String,  default: ''
            },

            actionType: {
                type: String,  default: ''
            }
        }
    ],

    created: {
        type: Date,
        default: Date.now
    }

},{ versionKey: false });


mongoose.model('Questions', QuestionsSchema);
