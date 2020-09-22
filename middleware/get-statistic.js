const moment = require('moment');
const Product = require('../models/product.model');
const Orderstatus = require('../models/orderstatus.model');
const getCount = require('./get-count-form-mongo');



const getProductStatistic = async () => {


    try {

        const countlevel1Aggregate = await Product.aggregate([

            {
                $project: {
                    _id: 0,
                    level1_data: 1
                }
            },
            { $unwind: "$level1_data" },
            { $group: { _id: null, myCount: { $sum: 1 } } },
            { $project: { _id: 0 } }

        ]);
        
        const countlevel1 = (countlevel1Aggregate.length) ? countlevel1Aggregate[0].myCount : 0;

        const countlevel2Aggregate = await Product.aggregate([

            {
                $project: {
                    _id: 0,
                    level1_data: 1
                }
            },
            { $unwind: "$level1_data" },
            { $unwind: "$level1_data.level2" },

            { $group: { _id: null, myCount: { $sum: 1 } } },
            { $project: { _id: 0 } }

        ]);
        
        const countlevel2 = (countlevel2Aggregate.length) ? countlevel2Aggregate[0].myCount : 0;

        const countlevel2nullAggregate = await Product.aggregate([

            {
                $project: {
                    _id: 0,
                    level1_data: 1
                }
            },
            { $unwind: "$level1_data" },
            { $unwind: "$level1_data.level2" },
            {
                $project: {
                    amount: '$level1_data.level2.amount'
                }
            },
            { $match: { amount: 0 } },
            { $group: { _id: null, myCount: { $sum: 1 } } },
            { $project: { _id: 0 } }

        ]);

        const countlevel2null = (countlevel2nullAggregate.length) ? countlevel2nullAggregate[0].myCount : 0;

        return { countlevel1, countlevel2, countlevel2null }

    } catch (e) {

        throw e
    }
}

module.exports.product = async () => {
    try {
        const product = {
            countall: 0,
            countoff: 0,
            countlevel1: 0,
            countlevel2: 0,
            countlevel2null: 0,
        };

        const countall = await getCount('product');
        if (countall.err) {
            throw new Error('Ошибка запроса product.countall')
        }
        product.countall = countall.count;

        const countoff = await getCount('product', { status: false });

        if (countoff.err) {
            throw new Error('Ошибка запроса product.countoff')
        }
        product.countoff = countoff.count;

        const rezult = await getProductStatistic();

        product.countlevel1 = rezult.countlevel1;
        product.countlevel2 = rezult.countlevel2;
        product.countlevel2null = rezult.countlevel2null;

        return product;

    } catch (e) {

        throw e
    }
}

module.exports.order = async () => {

    try {
        const order = {
            countall: 0,
            countnew: 0,
            countdivelery: 0,
            countspend: 0,
        };
        const countall = await getCount('order');
        if (countall.err) {
            throw new Error('Ошибка запроса order.countall')
        }
        order.countall = countall.count;

        const newstatus = await Orderstatus.findOne({ newstatus: true }, { _id: 1 });
        if (newstatus) {
            const countnew = await getCount('order', { orderStatus_id: newstatus._id });
            if (countall.err) {
                throw new Error('Ошибка запроса order.countnew')
            }
            order.countnew = countnew.count;
        }

        const divelerystatus = await Orderstatus.findOne({ divelerystatus: true }, { _id: 1 });
        if (divelerystatus) {
            const countdivelery = await getCount('order', { orderStatus_id: divelerystatus._id });
            if (countdivelery.err) {
                throw new Error('Ошибка запроса order.countdivelery')
            }
            order.countdivelery = countdivelery.count;
        }

        const spendstatus = await Orderstatus.findOne({ spendstatus: true }, { _id: 1 });
        if (spendstatus) {
            const countspend = await getCount('order', { orderStatus_id: divelerystatus._id });
            if (countspend.err) {
                throw new Error('Ошибка запроса order.countspend')
            }
            order.countspend = countspend.count;
        }
        return order;
    } catch (e) {

        throw e
    }

}

module.exports.news = async () => {

    try {
        const news = {
            countall: 0,
            countoff: 0,
        };
        const countall = await getCount('news');
        if (countall.err) {
            throw new Error('Ошибка запроса news.countall')
        }
        news.countall = countall.count;

        const countoff = await getCount('news', { status: false });
        if (countoff.err) {
            throw new Error('Ошибка запроса news.countoff')
        }
        news.countoff = countoff.count;

        return news;
    } catch (e) {

        throw e
    }

}

module.exports.comment = async () => {

    try {

        const comment = {
            countall: 0,
            countnew: 0,
        }

        const countall = await getCount('comment');
        if (countall.err) {
            throw new Error('Ошибка запроса comment.countall')
        }
        comment.countall = countall.count;

        const countnew = await getCount('comment', { status: false });
        if (countnew.err) {
            throw new Error('Ошибка запроса comment.countoff')
        }
        comment.countnew = countnew.count;
        return comment;

    } catch (e) {

        throw e
    }

}

module.exports.acquirer = async () => {

    try {
        const acquirer = {
            countall: 0,
            countblock: 0,
            countreturncall: 0,
            returnproduct: 0,
        }
        const countall = await getCount('acquirer');
        if (countall.err) {
            throw new Error('Ошибка запроса acquirer.countall')
        }
        acquirer.countall = countall.count;

        const countblock = await getCount('acquirer', { status_block: true });
        if (countblock.err) {
            throw new Error('Ошибка запроса acquirer.countblock')
        }
        acquirer.countblock = countblock.count;

        const countreturncall = await getCount('returncall', { status: false });
        if (countreturncall.err) {
            throw new Error('Ошибка запроса acquirer.countreturncall')
        }
        acquirer.countreturncall = countreturncall.count;

        const returnproduct = await getCount('returnproduct', { status: false });
        if (returnproduct.err) {
            throw new Error('Ошибка запроса acquirer.returnproduct')
        }
        acquirer.returnproduct = returnproduct.count;

        return acquirer;
    } catch (e) {

        throw e
    }

}

module.exports.category = async () => {

    try {
        const category = {
            countall: 0,
            countoff: 0,
            counton: 0,
        }
        const countall = await getCount('category');
        if (countall.err) {
            throw new Error('Ошибка запроса category.countall')
        }
        category.countall = countall.count;

        const countoff = await getCount('category', { status: false });
        if (countoff.err) {
            throw new Error('Ошибка запроса category.countoff')
        }
        category.countoff = countoff.count;
        category.counton = category.countall - category.countoff;

        return category;

    } catch (e) {

        throw e
    }

}


module.exports.ordergraf = async () => {

    try {
        const ordergraf = {
            labels: [],
            value: []
        };

        const today = new Date();
        const items = []

        for (let i = 0; i <= 10; i++) {

            const interval = (i === 0) ? 0 : (i * -1);
            const timeStamp = moment.utc(today).add(interval, 'months').format();

            const item = {
                startOf: moment.utc(timeStamp).startOf('month').format(),
                endOf: moment.utc(timeStamp).endOf('month').format(),
                label: moment(timeStamp).format('MM.YYYY')
            }
            items.push(item)
        }
        const reversed = items.reverse();
        for (let q = 0; q < reversed.length; q++) {
            const el = reversed[q];
            const filter = {
                $and: [
                    { createdAt: { $gte: el.startOf } },
                    { createdAt: { $lte: el.endOf } }
                ]
            }
            const count = await getCount('order', filter);
            const label = `${el.label} - ${count.count}`;
            const value = count.count;

            ordergraf.labels.push(label);
            ordergraf.value.push(value);
        }

        return ordergraf;
    } catch (e) {

        throw e
    }

}
