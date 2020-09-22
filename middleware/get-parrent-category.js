const Category = require('../models/category.model')


async function getParrentCategoryForProduct(category_id, status = true, rezult = []) {

    try {
        const doc = await Category.findById(category_id, { _id: 0, title: 1, alias: 1, status: 1, parent_id: 1 });
        let root = false;
        let item = {};
        if (doc !== null) {
            if (status === true && doc.status === false) {
                root = true;
            }
            if (root === false) {
                item['text'] = doc.title;
                item['disabled'] = false;
                item['href'] = '/category/' + doc.alias;
                item['level'] = 0;
                rezult.push(item);
                if (String(category_id) !== String(doc.parent_id)) {
                    rezult = await getParrentCategoryForProduct(doc.parent_id, status, rezult);
                }
            }
        } else {
            root = true;
        }
        if (root === true) {
            const rootDoc = await Category.findOne({ cat_default: true }, { _id: 0, title: 1, alias: 1 });
            if (rootDoc !== null) {
                item = {};
                item['text'] = rootDoc.title;
                item['disabled'] = false;
                item['href'] = '/category/' + rootDoc.alais;
                item['level'] = 0;
                rezult.push(item);
            }
        }

    } catch (e) {
        console.error(e.message);
    }

    return rezult
}




module.exports = async (category_id, status = true, rezult = []) => {
    try {
        return await getParrentCategoryForProduct(category_id, status, rezult)

    } catch (e) {
        console.error(e.message);
    }
   
};