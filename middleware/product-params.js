const Brand = require('../models/brand.model');
const Filter = require('../models/filter.model');
const Сolor = require('../models/colors.model');



const getProductColors = async (colors = []) => {

    let rezult = "";
    try {
        const aggregate = await Сolor.aggregate([

            {
                $project: {
                    "_id": 0,
                    "children": 1
                }
            },
            { $unwind: "$children" },
            {
                $project: {
                    title: "$children.title",
                    alias: "$children.aliasitem"
                }
            },
            { $match: { "alias": { $in: colors } } },
            {
                $group:
                {
                    _id: 'colors',
                    colors: { $push: "$title" }
                }
            }

        ])

        if (aggregate.length > 0) {
            rezult = aggregate[0].colors;
            if (rezult.length > 0) {
                rezult = 'Доступные варианты цветов: ' + rezult.join(', ') + '.';
            }
        }

    } catch (e) {
        console.error(e);
    }

    return rezult;

}



const getProductFilter = async (filters = []) => {



    try {
        const rezult = {};
        const aggregate = await Filter.aggregate([
            { $match: { status: true, cartproduct: true } },
            {
                $project: {
                    "_id": 0,
                    "alias": 1,
                    "attrs": 1
                }
            },
            { $unwind: "$attrs" },
            {
                $project: {
                    title: "$attrs.title",
                    alias: "$alias",
                    alias_attrs: "$attrs.alias_attrs",
                    sortvalueitem: "$attrs.sortvalueitem",
                    status_attr: "$attrs.status_attr"
                }
            },
            { $match: { alias_attrs: { $in: filters }, status_attr: true } },
            { $sort: { sortvalueitem: 1 } },

            {
                $group:
                {
                    _id: '$alias',
                    attrs: { $push: "$title" }
                }
            }

        ])

        if (aggregate.length > 0) {
            aggregate.forEach((item) => {
                if (item.attrs.length > 0) {
                    rezult[item._id] = item.attrs;

                }
            })


        }
        return rezult;
    } catch (e) {
        console.error(e);
        return {}
    }
}

const getBrands = async () => {
    try {
        const rezult = {};
        brands = await Brand.find({}, { _id: 1, title: 1, img: 1 }).sort({ sortvalue: 1 });
        brands.forEach((item) => {
            rezult[item._id] = {
                title: item.title,
                img: item.img,
            }
        });
        return rezult

    } catch (e) {
        // console.error(e);
        throw e
    }
}



module.exports.getBrands = async () => {

    try {

        return await getBrands();

    } catch (e) {
        // console.error(e);
        throw e
    }
}


module.exports.getProductColors = async (colors = []) => {

    return await getProductColors(colors);
}


module.exports.getProductFilter = async (filters = []) => {

    return await getProductFilter(filters);

}

module.exports.getProductPatternData = async (product, level1, currSymbol, level1Obj = true) => {
    const patternData = {};
    let filterData = {};
    try {
        patternData.product_gender = product.gender;
        patternData.product_gender_lower = patternData.product_gender.toLocaleLowerCase();
        patternData.product_gender_pril = patternData.product_gender.replace(/(е+$)/ui, 'х');
        patternData.product_gender_lower_pril = patternData.product_gender_pril.toLocaleLowerCase();
        const brand = await Brand.findById(product.brand_id, { _id: 0, title: 1 });
        patternData.brand_title = "";
        if (brand !== null) {
            patternData.brand_title = brand.title
        }
        patternData.sku = product.sku;
        patternData.product_name_full = product.title;
        patternData.product_name = patternData.product_name_full.replace(/([а-я]+)/ui, '').trim();
        patternData.product_name_full = product.title;
        let product_price_discont_value = 0;
        patternData.product_price = product.price + ' ' + currSymbol;
        patternData.product_old_price = "";

        if (Number(product.price) < Number(product.old_price)) {
            product_price_discont_value = Number(product.old_price) - Number(product.price);
            patternData.product_old_price = product.old_price + ' ' + currSymbol;
        }
        if (product_price_discont_value > 0) {
            patternData.product_price_discont_proc = product.price / (product.old_price / 100);
            patternData.product_price_discont_proc = Math.round(100 - patternData.product_price_discont_proc);
            patternData.product_price_discont_proc += "%";
            patternData.product_price_text = 'Цена с учетом скидки ' + patternData.product_price_discont_proc + ' - ' + product.price + ' ' + currSymbol + '. Ваша экономия составит ' + product_price_discont_value + ' ' + currSymbol + '.';
            patternData.product_price_discont_procoi = ' со скидкой ' + patternData.product_price_discont_proc;
            patternData.product_price_discont_proc = ' скидка ' + patternData.product_price_discont_proc;
            patternData.product_price_discont_value = 'экономия ' + product_price_discont_value + ' ' + currSymbol;
            patternData.product_price_discont_defis = ' -';
        } else {
            patternData.product_price_discont_value = '';
            patternData.product_price_discont_proc = '';
            patternData.product_price_text = '';
            patternData.product_price_discont_procoi = '';
            patternData.product_price_discont_value = '';
            patternData.product_price_discont_defis = '';
        }
        patternData.colors = '';
        
        const colorsKeys = (level1Obj === true) ? Object.keys(level1) : level1;

        if (colorsKeys.length > 1) {
            patternData.colors = await getProductColors(colorsKeys);
        }

        patternData.filter = '';

        if (product.filter.length > 0) {
            filterData = await getProductFilter(product.filter);
        }
    } catch (e) {
        console.error(e);
    }

    return { patternData, filterData }
}