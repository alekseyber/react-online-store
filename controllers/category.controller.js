const Category = require('../models/category.model')
const Product = require('../models/product.model')
const Sort = require('../models/sort.model')
const Cache = require('../models/cache.model')
const applyPattern = require('../middleware/apply-pattern')
const getParrentCategory = require('../middleware/get-parrent-category')
const md5 = require('js-md5')


async function getProductsByCategory(category_ids = [], all = true, sortValueInput = undefined, status = true) {
    let qwery = {}
    let products = [];
    let colors = {};
    let level2 = {};
    let filter = {};
    let sortValue = false;
    let minPrice = 100000000;
    let maxPrice = 0;
    let countProduct = 0;
    let countModif = 0;

    if (status === false) {
        qwery = (all === true) ? {} : {
            category_ids: { $in: category_ids }
        };
    } else {
        qwery = (all === true) ? { status: true } : {
            status: true,
            category_ids: { $in: category_ids }

        };
        let sort_obj = {}

        let sort = null;
        if (sortValueInput !== undefined) {
            sort = await Sort.findById(sortValueInput, { order: 1, field: 1 });
        }

        if (sort === null) {
            sort = await Sort.findOne({ sort_default: true }, { _id: 1, order: 1, field: 1 });
            sortValue = sort._id;
        } else {
            sortValue = sortValueInput;
        }

        if (sort !== null) {
            sort_obj[sort.field] = (sort.order === true) ? -1 : 1;
        }

        const docs = await Product.find(qwery, { _id: 1, alias: 1, title: 1, price: 1, filter: 1, level1_data: 1, update_at: 1 }).sort(sort_obj);

        docs.forEach(item => {
            if (item.level1_filter !== false) {
                const el = {
                    alias: item.alias,
                    _id: item._id,
                    title: item.title,
                    update_at: item.update_at_filter,
                    price: item.price,
                    filter: item.filter_filter,
                    level1: item.level1_filter.level1,
                    level2: item.level1_filter.level2,
                }
                products.push(el)
                countProduct++;
                countModif += (Object.keys(el.level1).length);
                Object.assign(colors, item.level1_filter.colors);
                Object.assign(level2, item.level1_filter.level2);
                Object.assign(filter, item.filter_filter);
                if (minPrice > item.price) {
                    minPrice = item.price;
                }
                if (maxPrice < item.price) {
                    maxPrice = item.price;
                }
            }

        });

    }

    return { products, colors, level2, filter, sortValue, minPrice, maxPrice, countModif, countProduct }
}

async function getChildrenCategory(category_id = "", status = true, category_ids = []) {

    const qwery = (status === true) ? { status: true, parent_id: category_id } : { parent_id: category_id };
    try {
        const doc = await Category.find(qwery, { _id: 1 });
        if (doc.length > 0) {
            for (const item of doc) {
                category_ids.push(item._id);
                category_ids = await getChildrenCategory(item._id, status, category_ids);
            }
        }

    } catch (e) {
        console.error(e.message);
    }

    return category_ids
}

// function getTree(data) {
//     let itemsByID = {};
//     data.forEach((item) => {
//         // itemsByID[String(item._id)] = item;
//         // itemsByID[String(item._id)].childs = [];
//         itemsByID[String(item._id)] = {
//             _id: item._id,
//             img: item.img,
//             title: item.title,
//             alias: item.alias,
//             parent_id: item.parent_id,
//             childs: []
//         }

//     });

//     let rootKey = '';
//     let i = 0;
//     for (const item in itemsByID) {
//         if (String(itemsByID[item].parent_id) !== String(itemsByID[item]._id)) {
//             itemsByID[itemsByID[item].parent_id].childs.push(itemsByID[item]);
//         } else {
//             rootKey = item;
//         }

//         i++;
//     }
//     const roots = itemsByID[rootKey];

//     return roots
// }



// module.exports.getCategoryTree = async (req, res) => {

//     try {
//         const qwery = (req.query.status === false) ? {} : { status: true };
//         const category = await Category.find(qwery, { _id: 1, alias: 1, title: 1, img: 1, parent_id: 1 }).sort({ cat_default: -1, sortvalue: 1 });
//         if (category !== []) {
//             res.status(200).json(getTree(category));
//         } else {
//             res.status(404).send('Категории не найдены, повторите позднее');
//         }


//     } catch (e) {
//         console.error(e.message);
//         res.status(500).send('Получена ошибка БД');
//     }


// }

module.exports.getProductsForCategory = async (req, res) => {

    try {
        const category_alias = req.params.alias;
        const sortValue = req.query.sortValue;

        //  const category_alias = 'men';
        //  const sortValue = '5d67c94c80aa534110744e11';
        //category_alias !== undefined && category_alias instanceof String && category_alias.length > 0

        //      if (category_alias !== undefined && category_alias.length > 0) {
        const cacheKey = md5("category_" + category_alias + sortValue);
        const cacheAction = "category";
        let cacheData = await Cache.findOne({ cacheKey }, { _id: 0, cacheData: 1 });

        if (cacheData === null) {

            const doc = await Category.findOne({ alias: String(category_alias) }, { parent_id: 1, title: 1, meta: 1, htitle: 1, promo: 1, content: 1 });
            if (doc !== null) {

                let category_ids = [];
                let all = true;

                if (String(doc._id) !== String(doc.parent_id)) {
                    all = false;
                    category_ids = await getChildrenCategory(doc._id, true, [doc._id]);
                }

                const productsData = await getProductsByCategory(category_ids, all, sortValue);
                let contData = {};
                contData['meta_title'] = doc.meta.title;
                contData['meta_description'] = doc.meta.description;
                contData['meta_keywords'] = doc.meta.keywords;
                contData['title'] = doc.title;
                contData['htitle'] = doc.htitle;
                contData['promo'] = doc.promo;
                contData['content'] = doc.content;
                let patternData = {};
                patternData['price_pricefr'] = 'от ' + productsData.minPrice;
                patternData['price_priceto'] = 'до ' + productsData.maxPrice;
                patternData['count_modif'] = productsData.countModif;
                patternData['count_product'] = productsData.countProduct;

                contData = await applyPattern(contData, patternData);

                let breadcrumbs = await getParrentCategory(doc._id);
                if (breadcrumbs.length > 0) {
                    breadcrumbs[0].disabled = true;
                    breadcrumbs = breadcrumbs.reverse();
                    const iterator = breadcrumbs.keys();
                    for (let key of iterator) {
                        breadcrumbs[key]['level'] = key + 2;
                    }
                }
                contData['breadcrumbs'] = breadcrumbs;

                cacheData = {};
                cacheData['obj'] = { productsData, contData };
                const сache = new Cache({ cacheKey, cacheData, cacheAction });
                сache.save();
                res.status(200).json(cacheData['obj']);
            } else {
                res.status(404).send('Категория не существует');
                //  res.status(404).json({ message: 'Категория не существует' });
            }
        } else {
            res.status(200).json(cacheData.cacheData.get('obj'));
        }

        // } else {
        //     res.status(400).send('Alias не передан');
        //     //  res.status(404).json({ message: 'Alias не передан' });
        // }

    } catch (e) {
        console.error(e);
        res.status(500).send('Получена ошибка БД');
        // res.status(500).json(e);
    }
}

// module.exports.getSort = async (req, res) => {

//     let rezult = {
//         sortList: {},
//         sortValue: false
//     };
//     try {
//         rezult.sortList = await Sort.find({}, { _id: 1, text: 1, field: 1, order: 1, sort_default: 1 }).sort({ sortvalue: 1 });
//         rezult.sortValue = rezult.sortList[0]._id;
//         const sort_default = rezult.sortList.find((el) => el.sort_default);
//         if (sort_default !== undefined) {
//             rezult.sortValue = sort_default._id;
//         }

//     } catch (e) {
//         console.error(e.message);
//         res.status(500).send('Получена ошибка БД');
//     }

//     // console.log(rezult)
//     res.status(200).json(rezult)

// }
