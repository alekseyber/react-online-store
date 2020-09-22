const { model, Schema } = require('mongoose')

const paramsSchema = new Schema({

    select: {
        type: Boolean,
        default: false
    },
    phone: {
        href: {
            type: String,
            default: ""
        },
        title: {
            type: String,
            default: ""
        },
    },
    shop_name: {
        type: String,
        default: ""
    },
    shop_name_rus: {
        type: String,
        default: ""
    },
    shop_fullname_rus: {
        type: String,
        default: ""
    },
    streetAddress: {
        type: String,
        default: ""
    },
    shop_email: {
        type: String,
        default: ""
    },
    count_page_product: {
        type: Number,
        default: 16
    },
    count_page_comment: {
        type: Number,
        default: 10
    },
    count_page_news: {
        type: Number,
        default: 12
    },
    textDeliveryProduct: {
        type: String,
        default: ""
    },
    bannersDelivery: [{
        icons: {
            type: String,
            default: ""
        },
        title: {
            type: String,
            default: ""
        },
        str1: {
            type: String,
            default: ""
        },
        str2: {
            type: String,
            default: ""
        },
        sortvalue: {
            type: Number,
            default: 0,
            index: true
        }
    }],
    bannersProductOn: {
        type: Boolean,
        default: false
    },
    bannersProduct: [{
        img: {
            type: String,
            default: ""
        },
        title: {
            type: String,
            default: ""
        },
        str1: {
            type: String,
            default: ""
        },
        str2: {
            type: String,
            default: ""
        },
        sortvalue: {
            type: Number,
            default: 0,
            index: true
        }
    }],
    topLinks: [{
        icons: {
            type: String,
            default: ""
        },
        title: {
            type: String,
            default: ""
        },
        url: {
            type: String,
            default: "/"
        },
        sortTopLinks: {
            type: Number,
            default: 0,
            index: true
        }
    }],
    bottomLinks: [{
        title: {
            type: String,
            default: ""
        },
        list: [{
            icons: {
                type: String,
                default: "mdi-arrow-right-thick"
            },
            title: {
                type: String,
                default: ""
            },
            url: {
                type: String,
                default: "/"
            },
            sortBottomLinks: {
                type: Number,
                default: 0,
                index: true
            }
        }]
    }],
    productImgProperty: [{
        path: {
            type: String,
            required: true
        },
        img_width: {
            type: Number,
            default: 0
        },
        img_height: {
            type: Number,
            default: 0
        },
        status: {
            type: String,
            default: "",
            enum: ['minithumb', 'thumb', 'main', 'bigthumb', ''],
        },
        sortvalue: {
            type: Number,
            default: 0
        }
    }],
    categoryImgProperty: {
        type: String,
        default: ""
    },
    logoimg: {
        type: String,
        default: ""
    },
    currSymbol: {
        type: String,
        default: ""
    },
    currency: {
        type: String,
        default: "RUR",
        enum: ['RUR', 'USD', 'EUR', 'UAH', 'KZT'],
    },
    defaultDeliveryText: {
        type: String,
        default: ""
    },
    defaultDeliverySmallText: {
        type: String,
        default: ""
    },
    orderDoneText: {
        type: String,
        default: ""
    },
    orderPrintText: {
        type: String,
        default: ""
    },
    defaultDeliveryRegionText: {
        type: String,
        default: ""
    },
    maxDeliveryHourToday: {
        type: Number,
        default: 16,
        max: 20
    },
    qualityproductImg: {
        type: Number,
        default: 2,
        max: 3
    },
    baseUrl: {
        type: String,
        default: ""
    },
    visisbleTopBanner: {
        type: Boolean,
        default: true
    },
    timeCloseTopBanner: {
        type: Number,
        default: 0
    },
    cityDefault: {
        id: {
            type: Number,
            default: 44
        },
        cityName: {
            type: String,
            default: "Москва"
        },
        oblName: {
            type: String,
            default: "Москва"
        }
    },
})

module.exports = model('params', paramsSchema)