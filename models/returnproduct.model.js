const { model, Schema } = require('mongoose')
const Acquirer = require('../models/acquirer.model')



const returnproductSchema = new Schema({


    acquirer_id: {
        type: Schema.ObjectId,
        ref: Acquirer
    },
    phone: {
        type: String,
        required: true,
        index: true,
    },
    action: {
        type: Number,
        enum: [0, 1],
        default: 0
    },
    acquirer_ip: {
        type: String,
        default: ""
    },
    commentAdmin: {
        type: String,
        default: ""
    },
    status: {
        type: Boolean,
        default: false
    },
    date: {
        type: Date,
        default: Date.now,
        index: true
    }
},
    {
        timestamps: { createdAt: 'createdAt' },
        timestamps: { updatedAt: 'update_at' }
    }
);

returnproductSchema.index({ update_at: 1, type: -1 });

module.exports = model('returnproduct', returnproductSchema)