const SizesGroup = require('../models/sizesgroup.model')
//const Сolor = require('../models/colors.model')
//const Sizes = require('../models/sizes.model')



// module.exports.getColors = async (req, res) => {

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


//         res.status(200).json(rezult)

//     } catch (e) {
//         console.error(e);
//         res.status(500).send('Получена ошибка БД');
//     }

// }

// module.exports.getSizes = async (req, res) => {

//     try {
//         const sizes = await Sizes.find({ nosize: false }, { alias: 1, title: 1, tags: 1, }).sort({ sortvalue: 1 });
//         let rezult = {};

//         for (let i = 0; i < sizes.length; i++) {

//             rezult[sizes[i].alias] = {
//                 title: sizes[i].title,
//                 tags: sizes[i].tags
//             }
//         }
//         //  console.log(rezult);
//         res.status(200).json(rezult)

//     } catch (e) {
//         console.error(e);
//         res.status(500).send('Получена ошибка БД');
//     }

// }

module.exports.getSizesChartContent = async (req, res) => {
    const sizesgroup_id = req.query.sizesgroup_id;

    if (sizesgroup_id) {
        try {
            const content = await SizesGroup.findById(sizesgroup_id, { content: 1 });
            if (content === null) {
                res.status(404).send('Документ не найден');
            }
            res.status(200).json(content);
        } catch (e) {
            console.error(e);
            res.status(500).send('Получена ошибка БД');
        }
    } else {
        res.status(404).send('Не передан обязательный параметр запроса');
    }

}