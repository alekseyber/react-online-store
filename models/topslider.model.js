const { model, Schema } = require('mongoose')

const topsliderSchema = new Schema({

    status: {
        type: Boolean,
        default: false
    },
    sortvalue: {
        type: Number,
        default: 0,
        index: true
    },
    imgBackground: {
        type: String,
        required: true
    },
    maxHeightBackground: {
        type: Number,
        default: 500,
        min: 200,
        max: 1200
    },
    imgLogo: {
        type: String,
        default: ""
    },
    altLogo: {
        type: String,
        default: ""
    },
    topString1: {
        type: String,
        default: ""
    },
    topString2: {
        type: String,
        default: ""
    },
    topString3: {
        type: String,
        default: ""
    },
    topString4: {
        type: String,
        default: ""
    },
    bottomString1: {
        type: String,
        default: ""
    },
    bottomString2: {
        type: String,
        default: ""
    },
    bottomString3: {
        type: String,
        default: ""
    },
    bottomString4: {
        type: String,
        default: ""
    }

})

module.exports = model('topslider', topsliderSchema)