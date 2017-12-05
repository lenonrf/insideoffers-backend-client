'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    deepPopulate = require('mongoose-deep-populate')(mongoose),
    Schema = mongoose.Schema;

/**
 * A Validation function for local strategy properties
 */
var validateLocalStrategyProperty = function(property) {
    return ((this.provider !== 'local' && !this.updated) || property.length);
};

var WsClientItemSchema = new Schema({


    offer : {
        type: Schema.Types.ObjectId,
        ref: 'Offer'
    },

    user : {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },

    reason: {
        type: String,
        default: ''
    },

    uri: {
        type: String,
        default: ''
    },

    status: {
        type: Boolean
    },

    created: {
        type: Date,
        default: Date.now
    }

},{ versionKey: false });


WsClientItemSchema.plugin(deepPopulate, {});
mongoose.model('WsClientItem', WsClientItemSchema);
