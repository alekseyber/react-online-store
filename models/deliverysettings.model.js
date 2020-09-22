const { model, Schema } = require('mongoose')


// const phoneSchema = new Schema({
//     phone: {
//         type: String,
//         default: ''
//     },
// });

const servicesSchema = new Schema({
    code: {
        type: String,
        enum: ['TRYING_ON', 'DELIV_WEEKEND', 'PART_DELIV', 'INSPECTION_CARGO', 'INSURANCE']
    }
});

const deliverysettingsSchema = new Schema({

    vendor: {
        type: String,
        unique: true,
        required: true,
        enum: ['cdek'],
        default: "cdek"
    },
    //Тип заказа:
    // 1 - "интернет-магазин" (только для договора типа "Договор с ИМ")
    // 2 - "доставка" (для любого договора)
    type: {
        type: Number,
        enum: [1, 2],
        default: 1
    },
    // Код тарифа Сдек курьер
    tariff_code_courier: {
        type: Number,
        default: 137
    },
    // Код тарифа Сдек ПВЗ
    tariff_code_pvz: {
        type: Number,
        default: 136
    },
    // Код ПВЗ СДЭК, на который будет производится забор отправления, не обязательно
    shipment_point: {
        type: String,
        default: ''
    },
    //	Код валюты наложенного платежа: доп. сбора за доставку и оплаты за товар с получателя
    recipient_currency: {
        type: String,
        enum: ['RUB', 'USD', 'EUR', 'KZT', 'CNY'],
        default: "RUB"
    },
    // передавать дату заказа
    date_invoice_send: {
        type: Boolean,
        default: false
    },
    // передавать грузоотправителя
    shipper_send: {
        type: Boolean,
        default: false
    },
    // Грузоотправитель да, если заказ - международный
    shipper_name: {
        type: String,
        default: ''
    },
    // Грузоотправитель адрес да, если заказ - международный
    shipper_address: {
        type: String,
        default: ''
    },
    //Доп. сбор за доставку, которую ИМ берет с получателя.
    delivery_recipient_cost: {
        //Сумма дополнительного сбора (берется из заказа)
        value: {
            type: Number,
            default: 0
        },
        //Сумма НДС
        vat_sum: {
            type: Number,
            default: 0
        },
        //ставка НДС, null - нет
        vat_rate: {
            type: String,
            enum: ['null', '0', '10', '18', '20'],
            default: "null"
        },
    },
    //Параметры НДС продукта.
    product_payment: {
        //Стоимость товара (берется из заказа)
        value: {
            type: Number,
            default: 0
        },
        //Сумма НДС
        vat_sum: {
            type: Number,
            default: 0
        },
        //ставка НДС, null - нет
        vat_rate: {
            type: String,
            enum: ['null', '0', '10', '18', '20'],
            default: "null"
        },
    },
    // Передавать реквизиты Отправитель, для интернет магазинов не обязательно
    sender_status: {
        type: Boolean,
        default: false
    },
    // Отправитель
    sender: {
        //Название компании
        company: {
            type: String,
            default: ''
        },
        //ФИО контактного лица
        name: {
            type: String,
            default: ''
        },
        //email
        email: {
            type: String,
            default: ''
        },
        //Список телефонов
        phones: {
            type: [String],
            default: []
        },
        // //Номер телефона
        // number: {
        //     type: String,
        //     default: ''
        // },
    },
    // Передавать реквизиты реального продавца нужен inn
    seller_status: {
        type: Boolean,
        default: false
    },
    // Реквизиты реального продавца Только для заказов "интернет-магазин" обязателен ИНН
    seller: {
        //Наименование истинного продавца
        name: {
            type: String,
            default: ''
        },
        //ИНН истинного продавца
        inn: {
            type: String,
            default: ''
        },
        //Телефон истинного продавца
        phone: {
            type: String,
            default: ''
        },
        // Код формы собственности 63 - ИП, 137 ООО
        ownership_form: {
            type: Number,
            enum: [9, 61, 63, 119, 137, 147],
            default: 63
        },
        //Адрес истинного продавца Используется при печати инвойсов
        address: {
            type: String,
            default: ''
        }
    },
    // Адрес отправления
    from_location: {
        //Код локации (справочник СДЭК)
        code: {
            type: Number,
            default: 44
        },
        //Код страны отправления
        country_code: {
            type: String,
            enum: ['RU'],
            default: 'RU'
        },
        //Строка адреса
        address: {
            type: String,
            default: ''
        }
    },
    // Дополнительные услуги
    // TRYING_ON - ПРИМЕРКА НА ДОМУ, DELIV_WEEKEND - ДОСТАВКА В ВЫХОДНОЙ ДЕНЬ, PART_DELIV - ЧАСТИЧНАЯ ДОСТАВКА, 
    //INSPECTION_CARGO - ОСМОТР ВЛОЖЕНИЯ, INSURANCE - Обеспечение страховой защиты посылки типа "интернет-магазин" - не передается
    services: {
        type: [servicesSchema],
        default: []
    },
    packages_comment: {
        type: String,
        default: ''
    },
    // Базовые параметры упаковки, для калькулятора
    package_base: {
        weight: { //Общий вес (в граммах)
            type: Number,
            default: 1000
        },
        length: { //Длина (в сантиметрах)
            type: Number,
            default: 38
        },
        width: { //Ширина (в сантиметрах)
            type: Number,
            default: 32
        },
        height: { //Высота (в сантиметрах)
            type: Number,
            default: 14
        }
    },
    //ставка НДС, null - нет
    // vat_rate: {
    //     type: String,
    //     enum: ['null', '0', '10', '18', '20'],
    //     default: "null"
    // },
    api_settings: {
        client_id: {
            type: String,
            default: ''
        },
        client_secret: {
            type: String,
            default: ''
        },
    },
    priceAdd: {
        type: Number,
        default: 0
    },
    package_one: {
        type: Boolean,
        default: false
    },
    url_item_product: {
        type: Boolean,
        default: false
    }

})

deliverysettingsSchema.pre('deleteOne', async function () {
    throw new Error('Не возможно удалить из этой таблицы.');
    // next();
});

module.exports = model('deliverysettings', deliverysettingsSchema)