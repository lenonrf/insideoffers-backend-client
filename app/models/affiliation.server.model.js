'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;


var AffiliationSchema = new Schema({


    name: {
        type: String,
        default: ''
    },

    code: {
        type: String,
        default: ''
    },

    codeProvider: {
        type: String,
        default: ''
    },

    description: {
        type: String,
        default: ''
    },

    keycode: {
        type: String,
        default: ''
    },

    created: {
        type: Date,
        default: Date.now
    }

},{ versionKey: false });


mongoose.model('Affiliation', AffiliationSchema);
