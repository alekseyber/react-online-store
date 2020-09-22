const Сolor = require('../models/colors.model');
const Sizes = require('../models/sizes.model');
const Sort = require('../models/sort.model');
const Bagde = require('../models/bagde.model');


module.exports.getColors = async () => {

    try {
        const colors = await Сolor.find().sort({ sortvalue: 1 });
        let rezult = {
            colorsGroup: {},
            colors: {}
        };

        for (let i = 0; i < colors.length; i++) {
            if (colors[i].children.length > 0) {
                rezult.colorsGroup[colors[i].alias] = {
                    title: colors[i].title,
                    sortvalue: colors[i].sortvalue,
                    tags: colors[i].tags,
                    colorkey: colors[i].colorkey,
                    children: []
                }

                for (let s = 0; s < colors[i].children.length; s++) {
                    rezult.colors[colors[i].children[s].aliasitem] = colors[i].children[s];
                    rezult.colorsGroup[colors[i].alias].children.push(colors[i].children[s].aliasitem)
                }

            }
        }

        return rezult

    } catch (e) {
        throw e
    }

}

module.exports.getSizes = async () => {

    try {
        const sizes = await Sizes.find({ nosize: false }, { alias: 1, title: 1, tags: 1, }).sort({ sortvalue: 1 });
        let rezult = {};

        for (let i = 0; i < sizes.length; i++) {

            rezult[sizes[i].alias] = {
                title: sizes[i].title,
                tags: sizes[i].tags
            }
        }
        return rezult;

    } catch (e) {
        throw e
    }

}

module.exports.getSort = async () => {

    let rezult = {
        sortList: {},
        sortValue: false
    };
    try {
        rezult.sortList = await Sort.find({}, { _id: 1, text: 1, field: 1, order: 1, sort_default: 1 }).sort({ sortvalue: 1 });
        rezult.sortValue = rezult.sortList[0]._id;
        const sort_default = rezult.sortList.find((el) => el.sort_default);
        if (sort_default) {
            rezult.sortValue = sort_default._id;
        }

    } catch (e) {
        console.error(e.message);
    }

    return rezult
}

module.exports.getBagdes = async () => {
    const rezult = {};

    try {

        bagdes = await Bagde.find({ status: true }, { title: 1, colorkey: 1 });
        await bagdes.forEach((item) => {
            rezult[item._id] = {
                text: item.title,
                colorkey: item.colorkey,
            }
        });


    } catch (e) {
        console.error(e.message);
    }
    return rezult;
}