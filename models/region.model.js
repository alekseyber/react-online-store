const { model, Schema } = require('mongoose')

const regionSchema = new Schema({

    oblName: {
        type: String,
        default: ''
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
    },
    id: {
        type: Number,
        default: 0
    },
    cityName: {
        type: String,
        default: ''
    },
})

module.exports = model('region', regionSchema)