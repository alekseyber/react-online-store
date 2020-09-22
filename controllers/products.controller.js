//const Bagde = require('../models/bagde.model');
const Product = require('../models/product.model');
const Bparams = require('../models/bparams.model');
const Cache = require('../models/cache.model');
const applyPattern = require('../middleware/apply-pattern');
const { getProductPatternData, getBrands } = require('../middleware/product-params');
const getParrentCategory = require('../middleware/get-parrent-category');
const md5 = require('js-md5');
const { Types } = require('mongoose');


// module.exports.getRecomacces = async (req, res) => {
//     try {
//         rezult = await Product.find({ cart_on: true, "level1_data.level1_status": true, "level1_data.level2.amount": { $gt: 0 } }, { alias: 1 }).limit(2);

//         res.status(200).json(rezult)

//     } catch (e) {
//         console.error(e);
//         res.status(500).send('Получена ошибка БД');
//     }
// }

// module.exports.getBrands = async (req, res) => {

//     try {
//         const rezult = await getBrands();
//         res.status(200).json(rezult)

//     } catch (e) {
//         console.error(e);
//         res.status(500).send('Получена ошибка БД');
//     }
// }

// module.exports.getBagdes = async (req, res) => {

//     let rezult = {};
//     try {
//         bagdes = await Bagde.find({ status: true }, { title: 1, colorkey: 1 });
//         await bagdes.forEach((item) => {
//             rezult[item._id] = {
//                 text: item.title,
//                 colorkey: item.colorkey,
//             }
//         });
//         res.status(200).json(rezult)

//     } catch (e) {
//         console.error(e);
//         res.status(500).send('Получена ошибка БД');
//     }
// }

// module.exports.getProductByAlias = async (req, res) => {
//     // const alias = String(req.query.alias);
//     const alias = req.params.alias;

//     try {
//         if (!alias) {
//             return res.status(404).send('Не найдено');
//         }
//         //if (alias.length > 0) {
//         const doc = await Product.findOne({ alias }, {
//             alias: 1,
//             title: 1,
//             product_model: 1,
//             sku: 1,
//             price: 1,
//             old_price: 1,
//             sizesgroup_id: 1,
//             brand_id: 1,
//             gender: 1,
//             color_default: 1,
//             related_id: 1,
//             level1_data: 1
//         }).populate({ path: 'related_id', select: { _id: 0, alias: 1 } });
//         if (doc !== null) {
//             const rezult = {
//                 title: doc.title,
//                 product_model: doc.product_model,
//                 sku: doc.sku,
//                 price: doc.price,
//                 old_price: doc.old_price,
//                 sizesgroup_id: doc.sizesgroup_id,
//                 brand_id: doc.brand_id,
//                 gender: doc.gender,
//                 color_default: doc.color_default,
//                 color_default_base: doc.color_default,
//                 related: "",
//                 level1: doc.level1,
//                 _id: doc._id
//             }
//             // if (doc.related_id) {
//             //     rezult.related = doc.related_id.alias;
//             // }

//             res.status(200).json(rezult)
//         } else {
//             res.status(404).send('Продукт не найден');
//         }

//         // } else {
//         //     res.status(400).send('Alias не передан');
//         // }

//     } catch (e) {
//         //console.error(e);
//         res.status(500).send(e.message);
//     }
// }


module.exports.getProductByAlias = async (req, res) => {

    const alias = req.params.alias;

    try {
        // if (!alias) {
        //     return res.status(404).send('Не найдено');
        // }

        const doc = await Product.findOne({ alias }, {
            alias: 1,
            title: 1,
            product_model: 1,
            sku: 1,
            price: 1,
            old_price: 1,
            sizesgroup_id: 1,
            brand_id: 1,
            gender: 1,
            color_default: 1,
            level1_data: 1
        });
        if (doc) {
            const rezult = {
                title: doc.title,
                alias: doc.alias,
                product_model: doc.product_model,
                sku: doc.sku,
                price: doc.price,
                old_price: doc.old_price,
                sizesgroup_id: doc.sizesgroup_id,
                brand_id: doc.brand_id,
                gender: doc.gender,
                color_default: doc.color_default,
                color_default_base: doc.color_default,
                level1: doc.level1,
                _id: doc._id
            }
            return res.status(200).json(rezult)
        } else {
            return res.status(404).send('Продукт не найден');
        }

    } catch (e) {
        //console.error(e);
        res.status(500).send(e.message);
    }
}

module.exports.getProductsByIds = async (req, res) => {
    const idsString = String(req.query.ids);
    const ids = idsString.split(",");
    const byalias = req.query.byalias;
    const where = {}
    if (byalias) {
        where.alias = { $in: ids }
    } else {
        where._id = { $in: ids }
    }
    //console.log(ids)
    // const ids = ['5d767189576f11368c679827', '5d767189576f11368c679888', '5d767189576f11368c6798b9']
    try {
        if (Array.isArray(ids) && ids.length > 0) {

            const docs = await Product.find(where, {
                alias: 1,
                title: 1,
                product_model: 1,
                sku: 1,
                price: 1,
                old_price: 1,
                sizesgroup_id: 1,
                brand_id: 1,
                gender: 1,
                color_default: 1,
                //  filter: 1,                
                level1_data: 1
            });
            let products = {};

            docs.forEach(item => {
                products[item.alias] = {
                    title: item.title,
                    alias: item.alias,
                    product_model: item.product_model,
                    sku: item.sku,
                    price: item.price,
                    old_price: item.old_price,
                    sizesgroup_id: item.sizesgroup_id,
                    brand_id: item.brand_id,
                    gender: item.gender,
                    color_default: item.color_default,
                    color_default_base: item.color_default,
                    //   filter: item.filter,                    
                    level1: item.level1,
                    _id: item._id
                }

            });

            res.status(200).json(products)
        } else {
            res.status(400).send('Ids не переданы');
        }

    } catch (e) {
        console.error(e.message);
        res.status(500).send('Получена ошибка БД');
    }
}

module.exports.getProductsHit = async (req, res) => {

    try {

        let countHits = req.query.countHits;
        countHits = Number(countHits);
        if (countHits === 0 || countHits > 16) {
            countHits = 8;
        }
        const aggregate = await Product.aggregate([
            { $match: { "status": true, "hit": true } },
            {
                $project: {
                    "alias": 1,
                    "level1_data": {
                        $filter: {
                            input: "$level1_data",
                            as: "level1",
                            cond: { $eq: ["$$level1.level1_status", true] }
                        }
                    }
                }
            },
            { $unwind: "$level1_data" },
            {
                $project: {
                    level2: "$level1_data.level2",
                    _id: "$_id",
                    alias: "$alias"
                }
            },
            { $unwind: "$level2" },
            {
                $project: {
                    amount: "$level2.amount",
                    _id: "$_id",
                    alias: "$alias"
                }
            },
            { $match: { amount: { $ne: 0 } } },
            { $group: { _id: '$_id', alias: { $first: "$alias" } } },
            { $sample: { size: countHits } }

        ])

        res.status(200).json(aggregate)
    } catch (e) {
        console.error(e.message);
        res.status(500).send('Получена ошибка БД');
    }
}

module.exports.getProductContent = async (req, res) => {


    try {

        // const id = req.params._id;
        // if (!id) {
        //     return res.status(404).send('Продукт не найден');
        // }

        const alias = req.params.alias;
        if (!alias) {
            return res.status(404).send('Продукт не найден');
        }

        const cacheKey = md5("productmain_" + alias);

        let cacheData = await Cache.findOne({ cacheKey }, { _id: 0, cacheData: 1 });
        let rezult = {};

        //    console.log('cacheData_getProductContent',cacheData)
        //   const doc = await Product.findById(id, {

        if (cacheData === null) {
            const doc = await Product.findOne({ alias }, {
                _id: 0,
                meta: 1,
                category_id: 1,
                content: 1,
                level1_data: 1,
                title: 1,
                price: 1,
                old_price: 1,
                gender: 1,
                brand_id: 1,
                sku: 1,
                filter: 1,
                related_id: 1
            }).populate({ path: 'related_id', select: { _id: 0, alias: 1 } });
            if (doc) {

                rezult.meta = doc.meta;
                rezult.content = doc.content;
                rezult.level1 = doc.level1_gal;
                // rezult.level1_gal = doc.level1_gal;
                // rezult.filter = {};
                rezult.related = '';
                if (doc.related_id) {
                    rezult.related = doc.related_id.alias;
                }
                let breadcrumbsparrent = await getParrentCategory(doc.category_id);
                if (breadcrumbsparrent.length > 0) {
                    breadcrumbsparrent = breadcrumbsparrent.reverse();
                    const iterator = breadcrumbsparrent.keys();
                    for (let key of iterator) {
                        breadcrumbsparrent[key]['level'] = key + 2;
                    }
                }
                rezult.breadcrumbsparrent = breadcrumbsparrent;
                const bparams = await Bparams.findOne({ select: true }, { _id: 0, product_meta: 1, currSymbol: 1 });
                if (rezult.meta.title.length === 0 || rezult.meta.description.length === 0) {

                    if (rezult.meta.title.length === 0) {
                        rezult.meta.title = bparams.product_meta.title
                    }
                    if (rezult.meta.description.length === 0) {
                        rezult.meta.description = bparams.product_meta.description
                    }
                    if (rezult.meta.keywords.length === 0) {
                        rezult.meta.keywords = bparams.product_meta.keywords
                    }
                }
                let contData = {};
                contData['meta_title'] = rezult.meta.title;
                contData['meta_description'] = rezult.meta.description;
                contData['meta_keywords'] = rezult.meta.keywords;
                contData['content'] = rezult.content;

                const currSymbol = bparams.currSymbol;
                const level1 = rezult.level1;

                const { patternData, filterData } = await getProductPatternData(doc, level1, currSymbol);
                rezult.filter = filterData;

                contData = await applyPattern(contData, patternData);
                rezult.meta.title = contData['meta_title'];
                rezult.meta.description = contData['meta_description'];
                rezult.meta.keywords = contData['meta_keywords'];
                rezult.content = contData['content'];
                cacheData = rezult;
                const cacheAction = "product";
                const сache = new Cache({ cacheKey, cacheData, cacheAction })
                сache.save()

            } else {
                rezult = false;
            }
        } else {
            rezult = cacheData.cacheData
        }
        if (rezult !== false) {
            res.status(200).json(rezult)
        } else {
            res.status(404).send('Продукт не найден');
        }
    } catch (e) {
        console.error(e);
        res.status(500).send(e.message);
    }
}


module.exports.getProductByLevelToo = async (req, res) => {
    try {
        const id = req.params.id;
        if (id) {
            const level2_id = Types.ObjectId(id);
            const product = await Product.findOne({ 'level1_data.level2._id': level2_id, status: true }, { alias: 1, price: 1, "level1_data.level2.$": 1 });

            if (product) {
                if (product.level1_data[0].level1_status) {
                    const level2 = product.level1_data[0].level2.find(item => String(item._id) === String(level2_id));
                    const level_price = product.level1_data[0].price;
                    const price = level_price ? level_price : product.price;
                    if (level2.amount > 0) {
                        const rezult = {
                            alias: product.alias,
                            color: product.level1_data[0].level1_alias,
                            sizes: level2.level2_alias,
                            price
                        }
                        return res.status(200).json(rezult);
                    }
                }

            }
        }

        return res.status(404).send('Продукт не найден');

    } catch (e) {
        console.error(e.message);
        res.status(500).send('Ошибка выполения запроса, попробуйте позже');
    }

}