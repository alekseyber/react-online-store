const { model, Schema } = require('mongoose')

const externalapikeySchema = new Schema({
    vendor: {
        type: String,
        unique: true,
        required: true
    },
    keyvalue: {
        type: String
    },
    secretkey: {
        type: String
    },
    servicekey: {
        type: String
    },
    idkey: {
        type: String
    },
    value: {
        type: String,
        default: ""
    },
    valueStr: {
        type: String,
        default: ""
    }
})

module.exports = model('externalapikey', externalapikeySchema)