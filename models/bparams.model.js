const { model, Schema } = require('mongoose')

const bparamsSchema = new Schema({

    select: {
        type: Boolean,
        default: false
    },
    product_meta: {
        title: {
            type: String,
            default: "@product_gender@ угги @product_name@ @brand_title@ @product_price@ - @product_price_discont_proc@"
        },
        description: {
            type: String,
            default: "@product_gender@ угги @product_name@ @product_price_discont_procoi@. @colors@ Интернет-магазин @shop_name@, телефон: @shop_tel@"
        },
        keywords: {
            type: String,
            default: "@brand_title@ @product_name@"
        },
    },
    currSymbol: {
        type: String,
        default: ""
    },
    baseUrl: {
        type: String,
        default: ""
    },
    adminEmail: {
        type: String,
        default: ""
    },
    saendAdminEmail: {
        type: Boolean,
        default: true
    },
    shopName: {
        type: String,
        default: ""
    },
    emailSettings: {
        fromEmail: {
            type: String,
            default: ""
        },
        host: {
            type: String,
            default: ""
        },
        port: {
            type: Number,
            default: 465
        },
        secure: {
            type: Boolean,
            default: true
        },
        auth_user: {
            type: String,
            default: ""
        },
        auth_pass: {
            type: String,
            default: ""
        }
    },
    textReturnProduct: {
        type: String,
        default: ""
    }
})

module.exports = model('bparams', bparamsSchema)