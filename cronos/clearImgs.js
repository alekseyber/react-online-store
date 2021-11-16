const Product = require('../models/product.model');
const Params = require('../models/params.model');
const Category = require('../models/category.model');

const fs = require('fs');
const path = require('path');


function strTrim(str, searchValue = '/') {

    if (str.indexOf(searchValue) === 0) {
        str = str.substring(1)
    }
    if (str.substr(-1, 1) === searchValue) {
        str = str.substring(0, (str.length - 1))
    }

    return str
}

async function getProducts() {
    try {

        const aggregate = await Product.aggregate([

            {
                $project: {
                    "_id": 0,
                    "level1_data": 1
                }
            },
            { $unwind: "$level1_data" },
            {
                $project: {
                    gallery: "$level1_data.gallery",
                }
            },
            { $unwind: "$gallery" },
            {
                $project: {
                    imgs: "$gallery.img",
                }
            },
            { $addFields: { groupselect: "group" } },
            { $addFields: { newobj: { "$arrayToObject": [[["$imgs", true]]] } } },
            {
                $group:
                {
                    _id: "groupselect",
                    group: { "$mergeObjects": "$newobj" }
                }
            }

        ])
        const products = aggregate[0].group;

        if (Object.keys(products).length === 0) {
            throw new Error('IMG Products не получено');
        }

        return products


    } catch (e) {
        //console.error(e);        
        throw e
    }

}


async function getCategory() {
    try {

        const aggregate = await Category.aggregate([

            {
                $project: {
                    "_id": 0,
                    "img": 1
                }
            },
            { $addFields: { groupselect: "group" } },
            { $addFields: { newobj: { "$arrayToObject": [[["$img", true]]] } } },
            {
                $group:
                {
                    _id: "groupselect",
                    group: { "$mergeObjects": "$newobj" }
                }
            }

        ])
        const category = aggregate[0].group;

        if (Object.keys(category).length === 0) {
            throw new Error('IMG Products не получено');
        }

        return category


    } catch (e) {
       // console.error(e);        
        throw e
    }

}

function getPath(url, pathStatic) {
    let pathRezult = pathStatic;
    url = strTrim(url);

    const arrTemp = url.split('/');
    arrTemp.forEach(el => {
        pathRezult = path.join(pathRezult, el);
    })

    return pathRezult
}

module.exports = async () => {
    try {

        const params = await Params.findOne({ select: true }, { _id: 0, categoryImgProperty: 1, productImgProperty: 1 });
        if (params === null) {
            throw new Error('Params не доступен, выполнение прервано');
        }

        const pathStatic = path.resolve(__dirname, '..', 'static');
                
        const products = await getProducts();
        const category = await getCategory();

        let count = 0;

        // ======= products ======
        params.productImgProperty.forEach(element => {
            const folder = getPath(element.path, pathStatic);
            const files = fs.readdirSync(folder);
            for (let file of files) {
                if ((file in products) === false && file !== 'no_image.jpg') {
                    const filePath = path.join(folder, file);
                    fs.unlinkSync(filePath);
                    count++;
                }
            }
        });

        // ======= category ======
        const folder = getPath(params.categoryImgProperty, pathStatic);
        const files = fs.readdirSync(folder);

        for (let file of files) {
            if ((file in category) === false && file !== 'no_image.jpg') {
                const filePath = path.join(folder, file);
                fs.unlinkSync(filePath);
                count++;
            }
        }


        return {
            status: 200,
            message: `Операция выполнена успешно, удалено ${count}`
        }
       

    } catch (e) {
       // console.error(e);
        throw e
    }
};