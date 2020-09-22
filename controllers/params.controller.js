//const Params = require('../models/params.model')
const Bparams = require('../models/bparams.model')




// module.exports.getParams = async (req, res) => {
//     try {
//         const docParams = await Params.findOne({ select: true }, { _id: 0 });
//         res.status(200).json(docParams)

//     } catch (e) {
//         console.error(e);
//         res.status(500).send('Получена ошибка БД');
//     }

// }

module.exports.getTextReturnProduct = async (req, res) => {
    try {
        const doc = await Bparams.findOne({ select: true }, { _id: 0, textReturnProduct: 1 });
        if (doc) {
            res.status(200).json(doc.textReturnProduct);
        } else {
            res.status(404).send('Параметр не найден');
        }


    } catch (e) {
        console.error(e);
        res.status(500).send('Получена ошибка БД');
    }

}


