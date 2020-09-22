const News = require('../models/news.model');
const applyPattern = require('../middleware/apply-pattern');




module.exports.getAll = async (req, res) => {
    try {
        const docs = await News.find({ status: true }, { _id: 0, alias: 1, title: 1, wtitle: 1, annonce: 1, img: 1 }).sort({ update_at: -1 });
        res.status(200).json(docs)

    } catch (e) {
        console.error(e.message);
        res.status(500).send('Получена ошибка БД');
    }

}


module.exports.getByAlias = async (req, res) => {
    try {
        const alias = req.params.alias;
        if (alias) {
            const doc = await News.findOne({ status: true, alias: alias }, { _id: 0, title: 1, annonce: 1, content: 1, meta: 1 });
            if (doc) {
                let contData = {};
                contData['title'] = doc.title;
                contData['meta_title'] = doc.meta.title;
                contData['meta_description'] = doc.meta.description;
                contData['meta_keywords'] = doc.meta.keywords;
                contData['annonce'] = doc.annonce;
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