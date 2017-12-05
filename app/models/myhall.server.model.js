'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    deepPopulate = require('mongoose-deep-populate')(mongoose),
    Schema = mongoose.Schema;


var MyHallSchema = new Schema({

    affiliation : {
        type: Schema.Types.ObjectId,
        ref: 'Affiliation'
    },

    sponsoring : [{
        type: Schema.Types.ObjectId,
        ref: 'Offer'
    }],

    survey : [{
        type: Schema.Types.ObjectId,
        ref: 'Offer'
    }],

    questionHall : [{
        type: Schema.Types.ObjectId,
        ref: 'Offer'
    }],

    balcony : [{
        type: Schema.Types.ObjectId,
        ref: 'Offer'
    }],

    created: {
        type: Date,
        default: Date.now
    }

},{ versionKey: false });

MyHallSchema.plugin(deepPopulate, {});
mongoose.model('MyHall', MyHallSchema);
