const Params = require('../models/params.model');
// const Сolor = require('../models/colors.model');
// const Sizes = require('../models/sizes.model');
// const Sort = require('../models/sort.model');
// const Bagde = require('../models/bagde.model');
const Product = require('../models/product.model');
const Category = require('../models/category.model');
const getFilter = require('../middleware/get-filter');
const { getDeliveryMidel } = require('../middleware/delivery');
const { getBrands } = require('../middleware/product-params');
const { getColors, getSizes, getSort, getBagdes } = require('../middleware/start-data');

// const getColors = async () => {

//     try {
//         const colors = await Сolor.find().sort({ sortvalue: 1 });
//         let rezult = {
//             colorsGroup: {},
//             colors: {}
//         };

//         for (let i = 0; i < colors.length; i++) {
//             if (colors[i].children.length > 0) {
//                 rezult.colorsGroup[colors[i].alias] = {
//                     title: colors[i].title,
//                     sortvalue: colors[i].sortvalue,
//                     tags: colors[i].tags,
//                     colorkey: colors[i].colorkey,
//                     children: []
//                 }

//                 for (let s = 0; s < colors[i].children.length; s++) {
//                     rezult.colors[colors[i].children[s].aliasitem] = colors[i].children[s];
//                     rezult.colorsGroup[colors[i].alias].children.push(colors[i].children[s].aliasitem)
//                 }

//             }
//         }

//         return rezult

//     } catch (e) {
//         throw e
//     }

// }

// const getSizes = async () => {

//     try {
//         const sizes = await Sizes.find({ nosize: false }, { alias: 1, title: 1, tags: 1, }).sort({ sortvalue: 1 });
//         let rezult = {};

//         for (let i = 0; i < sizes.length; i++) {

//             rezult[sizes[i].alias] = {
//                 title: sizes[i].title,
//                 tags: sizes[i].tags
//             }
//         }
//         return rezult;

//     } catch (e) {
//         throw e
//     }

// }

// const getSort = async () => {

//     let rezult = {
//         sortList: {},
//         sortValue: false
//     };
//     try {
//         rezult.sortList = await Sort.find({}, { _id: 1, text: 1, field: 1, order: 1, sort_default: 1 }).sort({ sortvalue: 1 });
//         rezult.sortValue = rezult.sortList[0]._id;
//         const sort_default = rezult.sortList.find((el) => el.sort_default);
//         if (sort_default) {
//             rezult.sortValue = sort_default._id;
//         }

//     } catch (e) {
//         console.error(e.message);
//     }

//     return rezult
// }

// const getBagdes = async () => {
//     const rezult = {};

//     try {

//         bagdes = await Bagde.find({ status: true }, { title: 1, colorkey: 1 });
//         await bagdes.forEach((item) => {
//             rezult[item._id] = {
//                 text: item.title,
//                 colorkey: item.colorkey,
//             }
//         });


//     } catch (e) {
//         console.error(e.message);
//     }
//     return rezult;
// }

const getTree = data => {
    let itemsByID = {};
    data.forEach((item) => {

        itemsByID[String(item._id)] = {
            _id: item._id,
            img: item.img,
            title: item.title,
            alias: item.alias,
            parent_id: item.parent_id,
            childs: []
        }

    });

    let rootKey = '';
    let i = 0;
    for (const item in itemsByID) {
        if (String(itemsByID[item].parent_id) !== String(itemsByID[item]._id)) {
            itemsByID[itemsByID[item].parent_id].childs.push(itemsByID[item]);
        } else {
            rootKey = item;
        }

        i++;
    }
    const roots = itemsByID[rootKey];

    return roots
}



const getCategoryTree = async () => {

    try {
        const category = await Category.find({ status: true }, { _id: 1, alias: 1, title: 1, img: 1, parent_id: 1 }).sort({ cat_default: -1, sortvalue: 1 });
        if (category.length) {
            return getTree(category)
        }

        throw new Error('Категории не найдены, повторите позднее');

    } catch (e) {
        throw e
    }

}


const getDeliveryData = async (req) => {

    try {
        return await getDeliveryMidel(req);

    } catch (e) {
        console.error(e.message);
        return {
            courier: {},
            pvz: {},
            status: false,
            errMsg: e.message,
            cityid: 44,
            city: {
                id: 44,
                cityName: "Москва",
                oblName: "Москва"
            }
        }
    }

}

module.exports.getStart = async (req, res) => {
    try {

        const paramsData = await Params.findOne({ select: true }, { _id: 0 });
        const colorsData = await getColors();
        const sizesData = await getSizes();
        const sortData = await getSort();
        const brandsData = await getBrands();
        const bagdesData = await getBagdes();
        const recomaccesData = await Product.find({
            cart_on: true,
            "level1_data.level1_status": true,
            "level1_data.level2.amount": { $gt: 0 }
        }, { alias: 1 }
        ).limit(2);
        const categorytreeData = await getCategoryTree();
        const filterData = await getFilter();
        const deliveryData = await getDeliveryData(req);


        res.status(200).json({
            paramsData,
            colorsData,
            sizesData,
            sortData,
            brandsData,
            bagdesData,
            recomaccesData,
            categorytreeData,
            filterData,
            deliveryData
        });

    } catch (e) {
        console.error(e.message);
        res.status(500).send('Получена ошибка БД, повторите попытку позже.');
    }

}




