const { model, Schema } = require('mongoose')

const cacheauthSchema = new Schema({

    cacheKey: {
        type: String,
        required: true,
        index: true,
        unique: true
    },
    cacheValue: {
        type: String,
        default: ""
    },
    createdAt: {
        type: Date,
        expires: 2700,
        default: Date.now
    }

})

module.exports = model('cacheauth', cacheauthSchema)