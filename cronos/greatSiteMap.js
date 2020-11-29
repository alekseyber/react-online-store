const Product = require('../models/product.model');
const Comment = require('../models/comment.model');
const Mainpage = require('../models/mainpage.model');
const Сolor = require('../models/colors.model');
const Params = require('../models/params.model');
const News = require('../models/news.model');
const Page = require('../models/page.model');
const Category = require('../models/category.model');
const { SitemapStream, streamToPromise } = require('sitemap');
const fs = require('fs');
const path = require('path');

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
                    title: "$children.title"

                }
            },

            { $addFields: { groupselect: "group" } },
            { $addFields: { newobj: { "$arrayToObject": [[["$alias", "$title"]]] } } },
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
        // console.error(e);        
        throw new Error('Ошибка БД Colors');
    }

}


async function getProducts(imgPrefix) {
    try {

        const docs = await Product.find({ status: true }, { alias: 1, title: 1, product_model: 1, color_default: 1, level1_data: 1, update_at: 1 });
        if (docs) {
            const colors = await getColors();
            const linkPrefix = '/product/';
            const products = [];

            for (let item of docs) {
                const title = item.title;
                const product_model = item.product_model;
                const update_at = item.update_at;
                const alias = item.alias;
                let color_default;
                if (item.color_default) {
                    color_default = item.color_default;
                } else {
                    const levelTrue = item.level1_data.find(el => {
                        if (el.level1_status) {
                            return false;
                        }
                        const level2 = el.level2.find(lev2 => lev2.amount > 0);
                        if (level2) {
                            return true;
                        }
                    })
                    color_default = levelTrue.level1_alias;
                }
                item.level1_data.forEach(level1 => {
                    let linkPostfix = '';
                    if (color_default !== level1.level1_alias && product_model < 3) {
                        linkPostfix = `?colors=${level1.level1_alias}`;
                    }
                    const level2 = level1.level2.find(lev2 => lev2.amount > 0);
                    if (level2) {
                        const obj = {
                            url: linkPrefix + alias + linkPostfix,
                            changefreq: 'daily',
                            priority: 1.0,
                            lastmod: update_at,
                            img: [],
                        }
                        let imgTitle = title;
                        if (level1.level1_alias in colors) {
                            imgTitle += ` ${colors[level1.level1_alias]}`
                        } else {
                            imgTitle += ` ${level1.level1_alias}`
                        }
                        for (let i = 0; i < level1.gallery.length; i++) {
                            const img = {
                                url: imgPrefix + level1.gallery[i].img,
                                title: imgTitle + ' - ' + (i + 1),
                            }
                            obj.img.push(img);
                        }
                        products.push(obj);

                    }

                })
            }



            return products
        }

    } catch (e) {
        console.error(e);
        throw new Error('Ошибка БД Products');
    }

}
async function getMaxDate(Model, field = 'update_at', filter = {}) {
    try {
        const protection = { _id: 0 };
        protection[field] = 1;

        const doc = await Model.findOne(filter, protection).sort(`-${field}`);
        if (doc) {
            return doc[field];
        }
        return new Date().toISOString
    } catch (e) {
        console.error(e);
        return new Date().toISOString
        // throw new Error('Ошибка БД Products');
    }
}


module.exports = async () => {
    try {

        const params = await Params.findOne({ select: true }, { _id: 0, baseUrl: 1, productImgProperty: 1 });
        if (params === null) {
            throw new Error('Params не доступен, выполнение прервано');
        }
        const productImgPrefixObj = params.productImgProperty.find(el => el.status === 'main');
        const products = await getProducts(productImgPrefixObj.path);
        const newsMaxDate = await getMaxDate(News, 'update_at', { status: true });
        const commentMaxDate = await getMaxDate(Comment, 'datas', { status: true });
        const mainpageMaxDate = await getMaxDate(Mainpage, 'update_at', { main: true });
        const arrActions = ['category', 'news', 'page'];
        const objectActions = {};
        objectActions.news = await News.find({ status: true }, { _id: 0, alias: 1, update_at: 1 });
        objectActions.page = await Page.find({ status: true }, { _id: 0, alias: 1, update_at: 1 });
        objectActions.category = await Category.find({ status: true }, { _id: 0, alias: 1, update_at: 1 });
        const filePath = path.resolve(__dirname, '..', 'staticroot', 'sitemap.xml');
        
        const smStream = new SitemapStream({
            hostname: params.baseUrl
        });

        smStream.write({
            url: '',
            changefreq: 'weekly',
            priority: 1.0,
            lastmod: mainpageMaxDate,
        });
        smStream.write({
            url: '/delivery',
            changefreq: 'weekly',
            priority: 1.0
        });
        smStream.write({
            url: '/news',
            changefreq: 'weekly',
            priority: 1.0,
            lastmod: newsMaxDate,
        });
        smStream.write({
            url: '/comment',
            changefreq: 'weekly',
            priority: 1.0,
            lastmod: commentMaxDate
        });

        if (products.length) {
            products.forEach(product => {
                smStream.write(product);
            })
        }
        arrActions.forEach(action => {
            if (objectActions[action]) {
                const linkPrefix = `/${action}/`;

                objectActions[action].forEach(element => {

                    const obj = {
                        url: linkPrefix + element.alias,
                        changefreq: 'weekly',
                        priority: 0.5,
                        lastmod: element.update_at,
                    }
                    smStream.write(obj);
                })
            }
        })

        smStream.end();
        const buffer = await streamToPromise(smStream);
        fs.writeFileSync(filePath, buffer);

        return {
            status: 201,
            message: 'Sitemap успешно создан и находится по адрсу /sitemap.xml'
        }


    } catch (e) {
        //  console.error(e.message);
        throw e
    }
};