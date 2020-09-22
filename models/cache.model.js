const { model, Schema } = require('mongoose')

const cacheSchema = new Schema({

    cacheKey: {
        type: String,
        required: true,
        index: true,
        unique: true
    },
    cacheData: {
        type: Map,
        required: true
    },
    cacheAction: {
        type: String,
        default: ""
    },
    createdAt: {
        type: Date,
        expires: '60m',
        default: Date.now
    }

})

module.exports = model('cache', cacheSchema)