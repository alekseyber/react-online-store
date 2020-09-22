const City = require('../models/city.model');
const Region = require('../models/region.model');
const Product = require('../models/product.model');
const Сolor = require('../models/colors.model');
const Sizes = require('../models/sizes.model');

class Fields {
    constructor(item, itemRegionsObj) {
        this.id = item.id;
        this.cityName = item.cityName;
        this.oblName = item.oblName;
        this.engName = item.engName;
        this.countryCode = itemRegionsObj.countryCode;
        this.regionCode = itemRegionsObj.regionCode;
    }

}

const getColors = async () => {
    try {
        const aggregate = await Сolor.aggregate([

            {
                $project: {
                    _id: 0,
                    children: 1,
                }
            },
            { $unwind: "$children" },
            {
                $project: {
                    alias: "$children.aliasitem",
                    title: "$children.title",
                }
            },

            { $addFields: { groupselect: "group" } },
            { $addFields: { newobj: { "$arrayToObject": [[["$alias", "$title"]]] } } },
            {
                $group:
                {
                    _id: "groupselect",
                    group: { "$mergeObjects": "$newobj" }
                }
            }

        ])
        const rezult = aggregate[0].group
        return rezult

    } catch (e) {
        throw new Error('Ошибка БД Colors');
    }

}

const getSizes = async () => {
    try {
        const aggregate = await Sizes.aggregate([

            //  { $match: { "nosize": false } },
            {
                $project: {
                    _id: 0,
                    alias: 1,
                    title: 1
                }
            },

            { $addFields: { groupselect: "group" } },
            { $addFields: { newobj: { "$arrayToObject": [[["$alias", "$title"]]] } } },
            {
                $group:
                {
                    _id: "groupselect",
                    group: { "$mergeObjects": "$newobj" }
                }
            }

        ])
        const rezult = aggregate[0].group;

        return rezult

    } catch (e) {

        throw new Error('Ошибка БД Sizes');
    }

}


module.exports.importcitycdek = async (inputData) => {

    try {
        if (inputData.length === 0) {
            throw new Error('Данные отсутствуют');
        }
        if (('id' in inputData[0]) === false || ('cityName' in inputData[0]) === false || ('oblName' in inputData[0]) === false || ('engName' in inputData[0]) === false) {
            throw new Error('Отсутствуют обязательные поля. Для просмотра обязательных полей, сделайте Export');
        }

        const resultArr = [];
        const regionsDoc = await Region.find();
        const regionsObj = {};
        regionsDoc.forEach(el => {
            regionsObj[el.oblName] = {
                countryCode: el.countryCode,
                regionCode: el.regionCode,
            }
        })
        inputData.forEach(item => {
            if (item.oblName in regionsObj) {
                const itemRes = new Fields(item, regionsObj[item.oblName])
                resultArr.push(itemRes);
            }
        })
        if (resultArr.length) {
            await City.deleteMany();
            await City.insertMany(resultArr);
            return {
                status: 201,
                message: 'Список городов успешно обновлен'
            }
        }
        throw new Error('Ошибка обхода данных');


    } catch (e) {
        // console.error(e);
        //  throw new Error(e.message);
        throw e

    }

};

module.exports.exportcitycdek = async () => {
    try {

        const aggregate = await City.aggregate([

            {
                $project: {
                    _id: 0,
                    id: 1,
                    cityName: 1,
                    oblName: 1,
                    engName: 1,
                }
            }
        ]);

        return aggregate;

    } catch (e) {
        throw e

    }
}

module.exports.importproduct = async (inputData) => {

    try {
        if (inputData.length === 0) {
            throw new Error('Данные отсутствуют');
        }
        if (('_id' in inputData[0]) === false) {
            throw new Error('Отсутствуют обязательное поле _id. Для просмотра редактируемых полей, сделайте Export');
        }
        const fields = ['title', 'sku', 'price', 'old_price', 'status', 'hit', 'cart_on'];
        const fieldselect = [];
        //  const projection = {};

        fields.forEach(field => {
            if (field in inputData[0]) {
                // projection[field] = 1;
                fieldselect.push(field);
            }
        });

        if (fieldselect.length === 0) {
            throw new Error('Нет полей для обновления');
        }

        let countEdit = 0;

        for (const item of inputData) {
            const product = await Product.findById(item._id, fieldselect);
            let save = false;
            fieldselect.forEach(fieldselect => {
                if (!save) {
                    save = true;
                }
                if (fieldselect === 'status' || fieldselect === 'hit' || fieldselect === 'cart_on') {
                    product[fieldselect] = Boolean(item[fieldselect]);
                } else {
                    product[fieldselect] = item[fieldselect];
                }

            })
            if (save) {
                await product.save();
                countEdit++;
            }
        }

        if (countEdit) {

            return {
                status: 200,
                message: `Успешно обновлено ${countEdit} записей`
            }
        }
        throw new Error('Ошибка обхода данных');

    } catch (e) {
        throw e
    }

};

module.exports.exportproduct = async () => {
    try {
        const docs = await Product.find({}, { title: 1, gender: 1, sku: 1, price: 1, old_price: 1, status: 1, hit: 1, cart_on: 1 });

        const rezult = [];
        docs.forEach(doc => {

            const obj = {
                _id: String(doc._id),
                gender: doc.gender,
                title: doc.title,
                sku: doc.sku,
                price: doc.price,
                old_price: doc.old_price,
                status: Number(doc.status),
                hit: Number(doc.hit),
                cart_on: Number(doc.cart_on)
            }
            rezult.push(obj);
        })
        return rezult;
    } catch (e) {
        throw e

    }
}

module.exports.importproductmodif = async (inputData) => {

    try {
        if (inputData.length === 0) {
            throw new Error('Данные отсутствуют');
        }
        if (('_id' in inputData[0]) === false) {
            throw new Error('Отсутствуют обязательное поле _id. Для просмотра редактируемых полей, сделайте Export');
        }

        if (('level1_id' in inputData[0]) === false) {
            throw new Error('Отсутствуют обязательное поле level1_id. Для просмотра редактируемых полей, сделайте Export');
        }

        const fields = ['price', 'old_price', 'level1_status'];
        const fieldselect = [];

        fields.forEach(field => {
            if (field in inputData[0]) {
                fieldselect.push(field);
            }
        });

        if (fieldselect.length === 0) {
            throw new Error('Нет полей для обновления');
        }

        let countEdit = 0;

        for (const item of inputData) {

            const doc = await Product.findById(item._id, { level1_data: 1 });
            const level1 = await doc.level1_data.id(item.level1_id);

            let save = false;

            if (level1) {
                fieldselect.forEach(fieldselect => {
                    if (!save) {
                        save = true;
                    }
                    if (fieldselect === 'level1_status') {
                        level1[fieldselect] = Boolean(item[fieldselect]);
                    } else {
                        level1[fieldselect] = item[fieldselect];
                    }
                })
            }

            if (save) {
                await doc.save();
                countEdit++;
            }

        }

        if (countEdit) {

            return {
                status: 200,
                message: `Успешно обновлено ${countEdit} записей`
            }
        }
        throw new Error('Данные не были обновлены');

    } catch (e) {
        throw e
    }

};

module.exports.exportproductmodif = async () => {
    try {
        const colors = await getColors();

        const aggregate = await Product.aggregate([

            {
                $project: {
                    gender: 1,
                    title: 1,
                    sku: 1,
                    level1_data: 1
                }
            },
            { $unwind: "$level1_data" },
            {
                $project: {
                    gender: "$gender",
                    title: "$title",
                    sku: "$sku",
                    level1_id: "$level1_data._id",
                    level1_alias: "$level1_data.level1_alias",
                    level1_status: "$level1_data.level1_status",
                    price: "$level1_data.price",
                    old_price: "$level1_data.old_price",
                }
            },

        ]);
        const rezult = [];
        aggregate.forEach(doc => {
            const alias = doc.level1_alias
            const color = (alias in colors) ? colors[alias] : alias;
            const obj = {
                _id: String(doc._id),
                level1_id: String(doc.level1_id),
                gender: doc.gender,
                title: doc.title,
                sku: doc.sku,
                color: color,
                price: doc.price,
                old_price: doc.old_price,
                level1_status: Number(doc.level1_status)
            }
            rezult.push(obj);
        })
        return rezult;
    } catch (e) {
        throw e

    }
}

module.exports.importproductamount = async (inputData) => {

    try {
        if (inputData.length === 0) {
            throw new Error('Данные отсутствуют');
        }
        if (('_id' in inputData[0]) === false) {
            throw new Error('Отсутствуют обязательное поле _id. Для просмотра редактируемых полей, сделайте Export');
        }

        if (('level1_id' in inputData[0]) === false) {
            throw new Error('Отсутствуют обязательное поле level1_id. Для просмотра редактируемых полей, сделайте Export');
        }

        if (('level2_id' in inputData[0]) === false) {
            throw new Error('Отсутствуют обязательное поле level2_id. Для просмотра редактируемых полей, сделайте Export');
        }

        if (('amount' in inputData[0]) === false) {
            throw new Error('Отсутствуют обязательное поле amount. Для просмотра редактируемых полей, сделайте Export');
        }

        let countEdit = 0;

        for (const item of inputData) {
            const amount = Number(item.amount);
            if (amount >= 0) {

                const doc = await Product.findById(item._id, { level1_data: 1 });
                const level1 = await doc.level1_data.id(item.level1_id);

                let save = false;

                if (level1) {
                    const level2 = await level1.level2.id(item.level2_id);
                    if (level2) {
                        level2.amount = amount;
                        save = true;
                    }
                }

                if (save) {
                    await doc.save();
                    countEdit++;
                }
            }
        }

        if (countEdit) {

            return {
                status: 200,
                message: `Успешно обновлено ${countEdit} записей`
            }
        }
        throw new Error('Данные не были обновлены');

    } catch (e) {
        throw e
    }

};

module.exports.exportproductamount = async () => {
    try {
        const colors = await getColors();
        const sizes = await getSizes();

        const aggregate = await Product.aggregate([

            {
                $project: {
                    gender: 1,
                    title: 1,
                    sku: 1,
                    level1_data: 1
                }
            },
            { $unwind: "$level1_data" },
            {
                $project: {
                    gender: "$gender",
                    title: "$title",
                    sku: "$sku",
                    level1_id: "$level1_data._id",
                    level1_alias: "$level1_data.level1_alias",
                    level2: "$level1_data.level2"
                }
            },
            { $unwind: "$level2" },
            {
                $project: {
                    gender: "$gender",
                    title: "$title",
                    sku: "$sku",
                    level1_id: "$level1_id",
                    level1_alias: "$level1_alias",
                    level2_id: "$level2._id",
                    level2_alias: "$level2.level2_alias",
                    amount: "$level2.amount",
                }
            },

        ]);
        const rezult = [];
        aggregate.forEach(doc => {

            const color = (doc.level1_alias in colors) ? colors[doc.level1_alias] : doc.level1_alias;
            const size = (doc.level2_alias in colors) ? sizes[doc.level2_alias] : doc.level2_alias;
            const obj = {
                _id: String(doc._id),
                level1_id: String(doc.level1_id),
                level2_id: String(doc.level2_id),
                gender: doc.gender,
                title: doc.title,
                sku: doc.sku,
                color,
                size,
                amount: doc.amount
            }
            rezult.push(obj);
        })
        return rezult;
    } catch (e) {
        throw e

    }
}