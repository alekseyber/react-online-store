const { model, Schema } = require('mongoose');
const Acquirer = require('../models/acquirer.model');
const Orderstatus = require('../models/orderstatus.model');
const Product = require('../models/product.model');
const Ordernumber = require('../models/ordernumber.model');
const getCountFormMongo = require('../middleware/get-count-form-mongo');


function phoneFormat(inputPhone) {
    let rezult = inputPhone.replace(/[^0-9]/gim, '');
    return rezult.replace(/^8/, "7");
}

const orderSchema = new Schema({

    orderNum: {
        type: String,
        index: true
    },
    orderStatus_id: {
        type: Schema.ObjectId,
        ref: Orderstatus
    },
    acquirer_id: {
        type: Schema.ObjectId,
        ref: Acquirer
    },
    acquirer_block: {
        type: Boolean,
        default: false
    },
    name: {
        type: String,
        default: "",
        maxlength: 150
    },
    surname: {
        type: String,
        default: ""
    },
    phone: {
        type: String,
        required: true,
        index: true,
    },
    cityName: {
        type: String,
        default: "Москва"
    },
    cityId: {
        type: Number,
        default: 44
    },
    oblName: {
        type: String,
        default: "Москва"
    },
    hiddenClient: {
        type: Boolean,
        default: false
    },
    // geoCountry: {
    //     type: String,
    //     default: ""
    // },
    // geoRegion: {
    //     type: String,
    //     default: ""
    // },
    // geoCity: {
    //     type: String,
    //     default: ""
    // },
    // geoTimezone: {
    //     type: String,
    //     default: ""
    // },
    acquirer_ip: {
        type: String,
        default: ""
    },
    street: {
        type: String,
        default: "",
        maxlength: 110
    },
    house: {
        type: String,
        default: "",
        maxlength: 20
    },
    flat: {
        type: String,
        default: "",
        maxlength: 20
    },
    comment: {
        type: String,
        default: "",
        maxlength: 350
    },
    cupon: {
        type: Boolean,
        default: false
    },
    cupon_id: {
        type: String,
        default: ""
    },
    discontcupon: {
        type: String,
        default: "1"
    },
    deliveryComment: {
        type: String,
        default: ""
    },
    commentAdmin: {
        type: String,
        default: "",
    },
    deliveryInvoiceHand: {
        type: Boolean,
        default: false
    },
    deliveryInvoice: {
        type: String,
        default: ""
    },
    deliveryUuid: {
        type: String,
        default: ""
    },
    deliverySelect: {
        type: Number,
        enum: [0, 1],
        default: 0
    },
    deliveryStatus: {
        type: Boolean,
        default: false
    },
    deliveryPrice: {
        type: Number,
        default: 0
    },
    deliveryPriceCourier: {
        type: Number,
        default: 0
    },
    deliveryPricePvz: {
        type: Number,
        default: 0
    },
    pvzCode: {
        type: String,
        default: ""
    },
    pvzSelect: {
        type: Boolean,
        default: false
    },
    payAwait: {
        type: Boolean,
        default: false
    },
    payStatus: {
        type: Boolean,
        default: false
    },
    paySumma: {
        type: Number,
        default: 0
    },
    summa: {
        type: Number,
        default: 0
    },
    cart: [{
        title: {
            type: String,
            default: ""
        },
        img: {
            type: String,
            default: ""
        },
        link: {
            type: String,
            default: ""
        },
        price: {
            type: Number,
            default: 0
        },
        basePrice: {
            type: Number,
            default: 0
        },
        qty: {
            type: Number,
            default: 1
        },
        itemSumm: {
            type: Number,
            default: 0
        },
        warning: {
            type: String,
            default: ""
        },
        product_id: {
            type: Schema.ObjectId,
            ref: Product
        },
        level1_alias: {
            type: String,
            default: ""
        },
        level2_alias: {
            type: String,
            default: ""
        },
        level1_id: {
            type: String,
            default: ""
        },
        level2_id: {
            type: String,
            default: ""
        },
        valid: {
            type: Boolean,
            default: false
        }
    }],
    datedivel: {
        type: Date,
        //default: Date.now,   
    },
    // update_at: {
    //     type: Date,
    //     default: Date.now
    // }
},
    {
        timestamps: { createdAt: 'createdAt' },
        timestamps: { updatedAt: 'update_at' }
    }
);

orderSchema.index({ update_at: 1, type: -1 });


orderSchema.pre('save', async function (next) {

    try {
        if (this.acquirer_id === undefined) {
            const count = await getCountFormMongo('order', { _id: this._id });
            if (count.count === 0) {
                if (this.phone) {
                    this.phone = phoneFormat(this.phone);
                    const phone = this.phone;
                    const acquirer = await Acquirer.findOneOrCreate({ phone });
                    this.acquirer_id = acquirer._id;
                    this.acquirer_block = acquirer.status_block;
                    if (!this.orderStatus_id) {
                        const orderStatusId = await Orderstatus.findOne({ newstatus: true }, { _id: 1 })
                        if (orderStatusId) {
                            this.orderStatus_id = orderStatusId._id;
                        } else {
                            new Error('Статус новый не найден.');
                        }
                    }
                    if (!this.orderNum) {
                        this.orderNum = await Ordernumber.getNumber();
                    }

                } else {
                    throw new Error('Не передано обязательное поле телефон, создание не возможно.');
                }
            }
        }

        next();
    } catch (e) {
        console.error(e);
        throw new Error(e.message);
    }
});

// orderSchema.post('save', async function (doc) {
//     console.log('presave-orderStatus', orderStatus_id)
//     console.log('presave-id', order_id)
//     console.log('postsave-id', doc._id)
//     console.log('postsave-orderStatus', doc.orderStatus_id)
// });

orderSchema.pre('deleteOne', async function (next) {
    const doc = await this.findOne().populate('orderStatus_id', 'spendstatus');

    if (doc.orderStatus_id.spendstatus) {
        throw new Error('Не воозможно удалить заказ в статусе выполнен, измените статус.');
    }
    if (doc.deliveryStatus) {
        throw new Error('Не воозможно удалить заказ, по заказу создана накладная СДЕК.');
    }

    next();
});


module.exports = model('order', orderSchema)