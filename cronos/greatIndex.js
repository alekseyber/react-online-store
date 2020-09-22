const Product = require('../models/product.model')
const Сolor = require('../models/colors.model')
const Sizes = require('../models/sizes.model')
const Brand = require('../models/brand.model')
const Filter = require('../models/filter.model')
const Indexproduct = require('../models/indexproduct.model')

async function getColors() {
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
                    alias: "$children.aliasitem",
                    search: {
                        $concat: [
                            "$children.title",
                            " ",
                            "$children.rustitle",
                            " ",
                            "$children.search_str",
                        ]
                    }
                }
            },
            {
                $project: {
                    alias: "$alias",
                    search: { '$trim': { input: "$search" } }
                    //search: "$search"
                }
            },
            { $addFields: { groupselect: "group" } },
            { $addFields: { newobj: { "$arrayToObject": [[["$alias", "$search"]]] } } },
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
        //  console.error(e);        
        throw new Error('Ошибка БД Colors');
        //  throw new Error(e.message);
    }

}

async function getSizes() {
    try {
        const aggregate = await Sizes.aggregate([
            { $match: { nosize: false } },
            {
                $project: {
                    "_id": 0,
                    "alias": 1,
                    "title": 1,
                    "search_str": 1,
                }
            },
            {
                $project: {
                    alias: "$alias",
                    search: {
                        $concat: [
                            "размер ",
                            "$title",
                            " ",
                            "$search_str",
                        ]
                    }
                }
            },
            {
                $project: {
                    alias: "$alias",
                    search: { '$trim': { input: "$search" } }
                    //search: "$search"
                }
            },
            { $addFields: { groupselect: "group" } },
            { $addFields: { newobj: { "$arrayToObject": [[["$alias", "$search"]]] } } },
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
        //console.error(e);
        throw new Error('Ошибка БД Saizes');
    }

}

async function getBrands() {
    try {
        const aggregate = await Brand.aggregate([

            {
                $project: {
                    "title": 1,
                    "search_str": 1,
                }
            },
            {
                $project: {
                    search: {
                        $concat: [
                            "$title",
                            " ",
                            "$search_str",
                        ]
                    }
                }
            },
            {
                $project: {
                    search: { '$trim': { input: "$search" } }
                }
            },
            { $addFields: { groupselect: "group" } },
            { $addFields: { newobj: { "$arrayToObject": [[[{ '$toString': "$_id" }, "$search"]]] } } },
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
        console.error(e);
        throw new Error('Ошибка БД Brands');
    }

}

async function getFilter() {
    try {
        const aggregate = await Filter.aggregate([
            { $match: { color: false, sizes: false, "attrs.status_attr": true } },
            {
                $project: {
                    "_id": 0,
                    "title": 1,
                    "attrs": 1
                }
            },
            { $unwind: "$attrs" },
            {
                $project: {
                    alias: "$attrs.alias_attrs",
                    search: {
                        $concat: [
                            "$title",
                            " ",
                            "$attrs.title"
                        ]
                    }
                }
            },
            {
                $project: {
                    alias: "$alias",
                    search: { '$trim': { input: "$search" } }
                   // search: "$search"
                }
            },
            { $addFields: { groupselect: "group" } },
            { $addFields: { newobj: { "$arrayToObject": [[["$alias", "$search"]]] } } },
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
        //console.error(e);        
        throw new Error('Ошибка БД Filters');
    }

}


function getItemContent(content) {
    const separator = ' ';
    content = content.replace(/<\/?[^>]+(>|$)/g, "");
    content = content.replace(/@\w+@/g, "");
    content = content.replace(/[.,!&?]/g, "");
    content = content.replace(/\s{2,}/g, " ");
    content = content.split(separator);
    content = content.filter(item => item.length > 1);
    let result = [];
    for (let str of content) {
        str = str.toLowerCase();
        if (!result.includes(str)) {
            result.push(str);
        }
    }

    content = result.sort();
    content = content.join(separator);

    return content
}

function getFilterText(filterArray, filters) {
    let rezult = "";
    filterArray.forEach(element => {
        if (element in filters) {
            const text = filters[element];
            rezult = rezult + " " + text;
        }
    });

    rezult = rezult.replace(/cartpr1|cartpr2/g, "");
    rezult = rezult.replace(/[.,!&?~™-]/g, "");
    rezult = rezult.replace(/\s{2,}/g, " ");
    rezult = rezult.trim();
    rezult = rezult.toLowerCase();
    return rezult
}



function greatItem(product_id, title, link, indexStr, sortvalue = 0, level = "") {
    return { product_id, level, title, link, sortvalue, indexStr }
}

function getItem(item, colors, sizes, brand, itemFilterText) {
    let rezult = [];
    const product_model = item.product_model;
    const product_id = item._id;
    const baseTitle = item.title;
    const baseLink = '/product/' + item.alias;
    const baseIndex = getItemContent((brand + ' ' + item.title + ' ' + item.sku + ' ' + item.content + ' ' + itemFilterText).trim());
    const level1_data = item.level1_data;
    const steps = 2;
    let status = false;
    let sizesAddStatus = [];

    for (let step = 0; step <= steps; step++) {

        let breakStatus = false;

        switch (step) {
            case 0:
                if (product_model === 3) {
                    breakStatus = true;
                    if (level1_data[0].level1_status && level1_data[0].level2[0].amount > 0) {
                        status = true;
                    }
                }
                rezult.push(greatItem(product_id, baseTitle, baseLink, baseIndex));
                break;

            case 1:
                if (product_model === 4) {
                    breakStatus = true;
                    if (level1_data[0].level1_status) {
                        level1_data[0].level2.forEach(element => {
                            if (element.amount > 0) {
                                if (element.level2_alias in sizes) {
                                    if (!status) {
                                        status = true;
                                    }
                                    rezult.push(greatItem(product_id, baseTitle, baseLink, getItemContent(baseIndex + ' ' + sizes[element.level2_alias])));
                                }
                            }
                        });

                    }
                }
                break;
            case 2:
                level1_data.forEach(element => {
                    if (element.level1_status) {
                        if (element.level1_alias in colors) {
                            let add = false;
                            const level = element.level1_alias;
                            const itemIndex = getItemContent(baseIndex + ' ' + colors[level]);
                            const link = baseLink + '?colors=' + level;

                            if (product_model === 2) {
                                if (element.level2[0].amount > 0) {
                                    add = true;
                                    if (!status) {
                                        status = true;
                                    }
                                }
                            } else {
                                element.level2.forEach(el => {
                                    if (el.amount > 0) {
                                        if (!status) {
                                            status = true;
                                        }
                                        add = true;
                                        if (el.level2_alias in sizes) {
                                            rezult.push(greatItem(product_id, baseTitle, link, getItemContent(itemIndex + ' ' + sizes[el.level2_alias]), 4, level));
                                            if (!sizesAddStatus.includes(el.level2_alias)) {
                                                sizesAddStatus.push(el.level2_alias);
                                                rezult.push(greatItem(product_id, baseTitle, baseLink, getItemContent(baseIndex + ' ' + sizes[el.level2_alias]), 3));
                                            }
                                        }
                                    }
                                });
                            }
                            if (add) {
                                rezult.push(greatItem(product_id, baseTitle, link, itemIndex, 2, level));
                            }

                        }
                    }
                });
                break;
        }
        if (breakStatus) {
            break;
        }
    }

    if (status) {
        return rezult
    } else {
        return []
    }
}

module.exports = async () => {
    try {
        console.info('greatIndex start');
        const docs = await Product.find({ status: true, "level1_data.level1_status": true }, { product_model: 1, title: 1, alias: 1, sku: 1, brand_id: 1, level1_data: 1, content: 1, filter: 1 }).sort({ update_at: -1 });
        if (docs.length > 0) {
            const colors = await getColors();
            const sizes = await getSizes();
            const brands = await getBrands();
            const filters = await getFilter();
            let indexRezult = [];
            let brand = "";

            for (let doc of docs) {
                if (doc.brand_id in brands) {
                    brand = brands[doc.brand_id];
                }
                const itemFilterText = getFilterText(doc.filter, filters);
                const itemProductIndex = getItem(doc, colors, sizes, brand, itemFilterText);
                if (itemProductIndex.length > 0) {
                    indexRezult = indexRezult.concat(itemProductIndex);
                }
            }
            const res = await Indexproduct.deleteMany({});
            console.info('greatIndex remove stored.', res.deletedCount);
            if (indexRezult.length > 0) {
                await Indexproduct.insertMany(indexRezult);
                console.info('greatIndex success');
                return {
                    status: 201,
                    message: 'Поисковый индекс успешно создан'
                }

            } else {
                console.error('greatIndex - FALSE No indexRezult Data');
                throw new Error('greatIndex - FALSE No indexRezult Data');
            }

        } else {
            console.error('greatIndex - Products - FALSE');
            throw new Error('greatIndex - Products - FALSE');
        }


    } catch (e) {
        console.error(e.message);
        //throw new Error('greatIndex error');
        throw e
    }
};