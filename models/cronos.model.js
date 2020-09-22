const { model, Schema } = require('mongoose')

const cronosSchema = new Schema({

    name: {
        type: String,
        default: ''
    },
    auth: {
        type: Boolean,
        default: true
    },
    status: {
        type: Boolean,
        default: false
    },
    work: {
        type: String,
        enum: ['greatIndex', 'clearCache', 'greatSiteMap', 'clearImgs', 'greatYml'],
        required: true
    },
    // cronTime: {
    //     type: String,
    //     default: '* * * * * *'
    // },
})

module.exports = model('cronos', cronosSchema)