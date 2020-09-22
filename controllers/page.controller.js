const Page = require('../models/page.model');
const applyPattern = require('../middleware/apply-pattern');



module.exports.getByAlias = async (req, res) => {
    try {
        const alias = req.params.alias;
        if (alias) {
            const doc = await Page.findOne({ status: true, alias: alias }, { _id: 0, title: 1, content: 1, meta: 1 });
            if (doc) {
                let contData = {};
                contData['title'] = doc.title;
                contData['meta_title'] = doc.meta.title;
                contData['meta_description'] = doc.meta.description;
                contData['meta_keywords'] = doc.meta.keywords;
                contData['content'] = doc.content;
                contData = await applyPattern(contData, {});

                res.status(200).json(contData)
            } else {
                res.status(404).send('Не существует');
            }

        } else {
            res.status(401).send('Алиас не передан');
        }


    } catch (e) {
        console.error(e.message);
        res.status(500).send('Получена ошибка БД');
    }

}



module.exports.getOferta = async (req, res) => {
    try {

        const doc = await Page.findOne({ oferta: true }, { _id: 0, content: 1 });
        let contData = {
            content: ""
        };
        if (doc) {
            contData.content = doc.content;
            contData = await applyPattern(contData, {});
        }

        res.status(200).json(contData)


    } catch (e) {
        console.error(e.message);
        res.status(500).send('Получена ошибка БД');
    }

}