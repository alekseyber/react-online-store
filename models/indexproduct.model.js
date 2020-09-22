const { model, Schema } = require('mongoose')
const products = require('../models/product.model')

const indexproductSchema = new Schema({
    product_id: {
        type: Schema.ObjectId,
        ref: products,
        index: true
    },
    level: {
        type: String,
        default: ""
    },
    title: {
        type: String,
        required: true
    },
    link: {
        type: String,
        required: true
    },
    sortvalue: {
        type: Number,
        default: 0,
        index: true
    },
    indexStr: {
        type: String,
        required: true
    }
})

indexproductSchema.index({ indexStr: "text" });

module.exports = model('indexproduct', indexproductSchema)