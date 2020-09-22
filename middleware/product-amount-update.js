const Order = require('../models/order.model');
const Product = require('../models/product.model');
const Orderstatus = require('../models/orderstatus.model');



async function getSpendStatusId() {

    try {

        const doc = await Orderstatus.findOne({ spendstatus: true }, { spendstatus: 1 });

        if (doc) {
            return doc._id;
        } else {
            return null
            // throw new Error('Orderstatus не найден');
        }
    } catch (e) {
        console.error('getSpendStatusId ' + e.message);
        return null
        //throw e
    }
}

async function getOrderById(id) {
    try {

        return await Order.findById(id, { orderStatus_id: 1, cart: 1 });
        // const doc = await Order.findOne({ _id: id }, { orderStatus_id: 1, cart: 1 });
        //return doc

    } catch (e) {
        console.error('getOrderById ' + e.message);
        return null
        // throw e
    }
}


async function updateAmountByOrderCart(cart, action) {
    try {
        let status = false
        for (const item of cart) {

            const rez = await updateAmountProductById(item.product_id, item.level1_id, item.level2_id, item.qty, action);
            if (rez && !status) {
                status = true
            }
        }
        return status

    } catch (e) {
        console.error('updateAmountByOrderCart ' + e.message);
        return false
        // throw e
    }
}


async function updateAmountProductById(product_id, level1_id, level2_id, count, action) {
    try {

        // const product_id = '5d72cac869717b3074ac46c5';
        // const level1_id = "5d72cac869717b3074ac470e";
        // const level2_id = "5d72cac869717b3074ac4718";
        // const count = 1;

        const doc = await Product.findById(product_id);
        const level1 = await doc.level1_data.id(level1_id);
        if (level1) {
            const level2 = await level1.level2.id(level2_id);
            if (level2) {
                if (action) {
                    if (level2.amount >= count) {
                        level2.amount = level2.amount - count;
                    } else {
                        level2.amount = 0;
                    }

                } else {
                    level2.amount = level2.amount + count;
                }

               // console.log(level2.amount);
                await doc.save();
                return true
            }
        }
        return false
    } catch (e) {
        console.error('updateAmountProductById ' + e.message);
        return false
        // throw e
    }
}



// Обновление складских остатков
module.exports.productAmountUpdate = async (order_id, oldOrderStatus_id) => {

    try {

        const order = await getOrderById(order_id);
        if (order === null) {
            return false;
        }
        const newOrderStatus_id = String(order.orderStatus_id);
        oldOrderStatus_id = String(oldOrderStatus_id);

        if (newOrderStatus_id === oldOrderStatus_id) {
            return false;
        }

        const spendStatusId = await getSpendStatusId();
        if (spendStatusId === null) {
            return false;
        }
        const strSpendStatusId = String(spendStatusId);

        if (oldOrderStatus_id !== strSpendStatusId && newOrderStatus_id !== strSpendStatusId) {
            return false;
        }
        let action = false;
        if (newOrderStatus_id === strSpendStatusId) {
            action = true;
        }

        return await updateAmountByOrderCart(order.cart, action);

    } catch (e) {
        console.error('exports - productAmountUpdate ' + e.message);
        // throw e.message
        // throw e
        return false
    }

}
