const Product = require('../models/product.model');
const Сolor = require('../models/colors.model');
const { getProductPatternData, getBrands } = require('../middleware/product-params');
const applyPattern = require('../middleware/apply-pattern');
const { addGet } = require('../middleware/urlscreater');
const Sizes = require('../models/sizes.model');
const Sizesgroup = require('../models/sizesgroup.model');
const Params = require('../models/params.model');
const Category = require('../models/category.model');
const { Builder } = require('xml2js');
const fs = require('fs');
const path = require('path');
const moment = require('moment');
const Idnumber = require('../models/idnumber.model');


const numbersId = {}


const getIdNumber = async (idMongo) => {

    try {
        idMongo = String(idMongo);

        if (idMongo in numbersId) {
            return numbersId[idMongo];
        }
        const idn = await Idnumber.findOneOrCreate(idMongo);
        numbersId[idMongo] = idn;
        return idn
    } catch (e) {
        // console.error(e);        
        throw new Error('Ошибка getIdNumber');
    }
}

const getColors = async () => {
    try {
        const aggregate = await Сolor.aggregate([

            {
                $project: {
                    _id: 0,
                    children: 1,
                    title: 1
                }
            },
            { $unwind: "$children" },
            {
                $project: {
                    alias: "$children.aliasitem",
                    title: "$title",
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
        // console.error(e);        
        throw new Error('Ошибка БД Colors');
    }

}

const getSizes = async () => {
    try {
        const aggregate = await Sizes.aggregate([

            { $match: { "nosize": false } },
            {
                $project: {
                    _id: 0,
                    alias: 1,
                    unitvalue: 1
                }
            },


            { $addFields: { groupselect: "group" } },
            { $addFields: { newobj: { "$arrayToObject": [[["$alias", "$unitvalue"]]] } } },
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
        // console.error(e);        
        throw new Error('Ошибка БД Sizes');
    }

}

const getFilterContent = (filterData) => {
    let content = '';
    if (filterData.cartpr1.length) {
        content = '<ul>';
        filterData.cartpr1.forEach(el => {
            content += `<li>${el}</li>`
        })
    }
    if (filterData.cartpr1.length) {

        filterData.cartpr2.forEach(el => {
            content += `<div>${el}</div>`
        })
    }
    return content
}


const getSizesgroup = async () => {

    try {
        let rezult = {};
        sizesgroup = await Sizesgroup.find({}, { age: 1, gender: 1, unit: 1 });
        await sizesgroup.forEach((item) => {
            rezult[item._id] = {
                age: item.age,
                gender: item.gender,
                unit: item.unit
            }
        });
        return rezult;

    } catch (e) {
        // console.error(e);
        throw new Error('Ошибка БД Sizesgroup');
    }
}

const getProducts = async (productImgPref, currencyId, currSymbol, baseUrl) => {
    try {

        const aggregate = await Product.aggregate([
            { $match: { "status": true } },
            {
                $project: {
                    alias: 1,
                    title: 1,
                    sku: 1,
                    price: 1,
                    old_price: 1,
                    brand_id: 1,
                    filter: 1,
                    gender: 1,
                    product_model: 1,
                    color_default: 1,
                    category_id: 1,
                    sizesgroup_id: 1,
                    content: 1,
                    level1_data: {
                        $filter: {
                            input: "$level1_data",
                            as: "level1_data",
                            cond: { $eq: ["$$level1_data.level1_status", true] }
                        }
                    }
                }
            },


        ]);

        const offers = []

        if (aggregate.length) {
            const brands = await getBrands();
            const colorsObj = await getColors();
            const sizesgroupObj = await getSizesgroup();
            const sizesObj = await getSizes();

            for (let i = 0; i < aggregate.length; i++) {

                const product = aggregate[i];

                const colors = [];
                product.level1_data.forEach(item => {
                    if (item.level1_status) {
                        const level2 = item.level2.filter(el => el.amount > 0)
                        if (level2.length) {
                            colors.push(item.level1_alias)
                        }
                    }

                })

                if (colors.length === 0) {
                    continue;
                }
                const { patternData, filterData } = await getProductPatternData(product, colors, currSymbol, false);

                let contData = { content: product.content };
                contData = await applyPattern(contData, patternData);

                const group_id = i + 1;
                const productBaseUrl = `${baseUrl}/product/${product.alias}`;
                let model = product.title;
                if (product.gender) {
                    model = `${product.gender} ${model}`
                }
                const categoryId = await getIdNumber(product.category_id) //String(product.category_id);
                const filterContent = getFilterContent(filterData);
                const content = String(contData.content + filterContent); // '<![CDATA[' +  + ']]'

                const vendorCode = product.sku;
                const price = product.price;
                const oldprice = product.old_price;
                const vendor = (product.brand_id in brands) ? brands[product.brand_id].title : false;
                const product_model = product.product_model;
                const color_default = product.color_default;
                const sizesgroup = sizesgroupObj[product.sizesgroup_id];

                product.level1_data.forEach(level1 => {
                    if (level1.level1_status) {
                        const picture = [];
                        let url = productBaseUrl;
                        level1.gallery.forEach(img => {
                            picture.push(`${productImgPref}${img.img}`)
                        })
                        if (product_model < 3) {
                            if (color_default !== level1.level1_alias) {
                                url = addGet(url, 'colors', level1.level1_alias, false);
                            }
                        }
                        level1.level2.forEach(item => {
                            if (item.amount > 0) {

                                const offer = {
                                    $: {
                                        id: item._id,
                                        type: 'vendor.model',
                                        group_id
                                    },
                                    url,
                                    price
                                }

                                if (oldprice > 0) {
                                    offer.oldprice = oldprice;
                                }

                                offer.currencyId = currencyId;
                                offer.categoryId = categoryId;
                                offer.picture = picture;
                                if (vendor) {
                                    offer.vendor = vendor;
                                }
                                if (vendorCode) {
                                    offer.vendorCode = vendorCode;
                                }

                                offer.model = model;

                                offer.delivery = 'true';
                                offer.pickup = 'true';
                                offer.store = 'true';
                                offer.description = content;
                                offer.param = [];

                                offer.param.push({
                                    $: {
                                        name: 'Пол',
                                    },
                                    _: sizesgroup.gender
                                });

                                offer.param.push({
                                    $: {
                                        name: 'Возраст',
                                    },
                                    _: sizesgroup.age
                                });

                                if (product_model < 3 && (level1.level1_alias in colorsObj)) {
                                    offer.param.push({
                                        $: {
                                            name: 'Цвет',
                                        },
                                        _: colorsObj[level1.level1_alias]
                                    });

                                }
                                if (product_model === 1 || product_model === 3 || product_model === 4) {
                                    // offer.url = addGet(url, 'sizes', item.level2_alias, false);
                                    if (item.level2_alias in sizesObj) {

                                        offer.param.push({
                                            $: {
                                                name: 'Размер',
                                                unit: sizesgroup.unit,
                                            },
                                            _: sizesObj[item.level2_alias]
                                        });
                                    }
                                }

                                // offer.condition = 'likenew';

                                offers.push(offer);
                            }

                        })

                    }
                })

            }

            return offers
        }

        throw new Error('Продукты не найдены');


    } catch (e) {
        console.error(e);
        throw new Error('Ошибка БД Products');
    }

}



module.exports = async () => {
    try {

        const params = await Params.findOne({ select: true }, {
            _id: 0,
            baseUrl: 1,
            shop_name: 1,
            shop_name_rus: 1,
            productImgProperty: 1,
            currency: 1,
            currSymbol: 1
        });
        if (params === null) {
            throw new Error('Params не доступен, выполнение прервано');
        }
        const productImgPrefixObj = params.productImgProperty.find(el => el.status === 'main');
        const products = await getProducts((params.baseUrl + productImgPrefixObj.path), params.currency, params.currSymbol, params.baseUrl);

        const category = await Category.find({ status: true }, { title: 1, parent_id: 1 });
        const filePath = path.resolve(__dirname, '../..', 'static', 'static', 'price.xml');

        //    console.log(filePath)

        const obj = {
            yml_catalog: {
                $: {
                    date: moment(new Date()).format("YYYY-MM-DD HH:mm")
                },
                shop: {
                    name: params.shop_name,
                    company: params.shop_name_rus,
                    url: params.baseUrl,
                    platform: 'Nuxt JS',
                    enable_auto_discounts: true,
                    currencies: {
                        currency: [{
                            $: {
                                id: params.currency,
                                rate: "1"
                            },
                        }]
                    },
                    categories: { category: [] },
                    offers: { offer: products },

                }
            }
        }

        //  category.forEach((item) => {
        for (const item of category) {
            const category = {
                $: {
                    id: await getIdNumber(item._id),
                },
                _: item.title
            }
            if (String(item._id) !== String(item.parent_id)) {
                category.$.parentId = await getIdNumber(item.parent_id);
            }
            obj.yml_catalog.shop.categories.category.push(category);
        }
        //  })

        const builder = new Builder({
            xmldec: { 'version': '1.0', 'encoding': 'UTF-8' },
            cdata: true,
        });

        const xml = builder.buildObject(obj);


        fs.writeFileSync(filePath, xml);

        return {
            status: 201,
            message: 'Яндекс прайслист успешно создан и находится по адрсу /price.xml'
        }

    } catch (e) {
        //  console.error(e.message);
        throw e
    }
};