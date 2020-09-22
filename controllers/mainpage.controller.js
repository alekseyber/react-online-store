const MainPage = require('../models/mainpage.model')
const Topslider = require('../models/topslider.model')
const Category = require('../models/category.model')
const applyPattern = require('../middleware/apply-pattern')
// const Cache = require('../models/cache.model')
// const md5 = require('js-md5')

module.exports.getMainPageData = async (req, res) => {

    try {
        let rezult = {};
        const mainPage = await MainPage.findOne({ main: true }, { _id: 0 });
        rezult.hitvisible = false;
        rezult.hitcount = 0;
        if (mainPage.hitvisible === true && mainPage.hitcount > 0) {
            rezult.hitvisible = true;
            rezult.hitcount = mainPage.hitcount;
            rezult.hittitle = mainPage.hittitle;
        }

        rezult.mainBanner = mainPage.mainBanner;
        rezult.topslidervisible = false;        

        if (mainPage.topslidervisible === true) {
            const topslider = await Topslider.findOne({ status: true }, { _id: 0 });
            if (topslider !== null) {
                rezult.topSlider = topslider;
                rezult.topslidervisible = true;
            }
        }
        rezult.maincatalogvisible = false;
        if (mainPage.maincatalogvisible === true && mainPage.maincatalogcount > 0) {
            const category = await Category.find({ status: true, main_page: true }, { _id: 0, alias: 1, title: 1, img: 1 }).limit(mainPage.maincatalogcount).sort({ sortvalue: 1 });
            if (category.length > 0) {
                rezult.maincatalogvisible = true;
                rezult.maincatalog = category;
                rezult.maincatalogprefix = mainPage.maincatalogprefix;
                rezult.maincatalogcount = mainPage.maincatalogcount;
            }
        }

        let contData = {};

        contData.meta_title = mainPage.meta.title;
        contData.meta_description = mainPage.meta.description;
        contData.meta_keywords = mainPage.meta.keywords;

        contData.title = mainPage.title;
        contData.promo = mainPage.promo;
        contData.content = mainPage.content;
        contData = await applyPattern(contData, {});

        rezult.meta = {
            title: contData.meta_title,
            description: contData.meta_description,
            keywords: contData.meta_keywords
        };
        rezult.title = contData.title;
        rezult.promo = contData.promo;
        rezult.content = contData.content;

        res.status(200).json(rezult)


    } catch (e) {
        console.error(e);
        res.status(500).send('Получена ошибка БД');
    }

}



