const { model, Schema } = require('mongoose')

const citySchema = new Schema({

    id: {
        type: Number,
        required: true,
        index: true
    },
    cityName: {
        type: String,
        required: true,
        index: true
    },
    oblName: {
        type: String,
        default: ''
    },
    engName: {
        type: String,
        default: '',
        index: true
    },
    countryCode: {
        type: String,
        index: true,
        default: 'RU'
    },
    regionCode: {
        type: String,
        index: true,
        default: ''
    }
})

module.exports = model('city', citySchema)