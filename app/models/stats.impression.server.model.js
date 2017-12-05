'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;


var StatsImpression = new Schema({

	affiliation : {
        type: Schema.Types.ObjectId,
        ref: 'Affiliation'
    },

    created: {
        type: Date,
        default: Date.now
    },

    offer :{
        type: Schema.Types.ObjectId,
        ref: 'Offers'
    }

},{ versionKey: false });

mongoose.model('StatsImpression', StatsImpression);
