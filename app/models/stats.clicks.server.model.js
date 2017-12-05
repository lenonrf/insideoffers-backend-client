'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;


var StatsClicks = new Schema({

    affiliation : {
        type: Schema.Types.ObjectId,
        ref: 'Affiliation'
    },

    created: {
        type: Date,
        default: Date.now
    },

    type :{
        type: String,
        default: ''
    },

    user :{
        type: Schema.Types.ObjectId,
        ref: 'Users'
    },

    offer :{
        type: Schema.Types.ObjectId,
        ref: 'Offers'
    }

},{ versionKey: false });

mongoose.model('StatsClicks', StatsClicks);
