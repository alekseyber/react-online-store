const { model, Schema } = require('mongoose')

const ordernumberSchema = new Schema({

    orderNumber: {
        type: Number,
        default: 0
    },
    status: {
        type: Boolean,
        default: false
    }

})

ordernumberSchema.static('getNumber', async function getNumber() {
    const doc = await this.findOne({ status: true });
    let rezult = '00-100';
    if (doc) {
        rezult = doc.orderNumber;
        const orderNumPrefix = Math.round(Math.random() * (99 - 10) + 10);
        rezult = orderNumPrefix + '-' + doc.orderNumber;
        doc.orderNumber++;
        doc.save();
    }

    return rezult;
});



module.exports = model('ordernumber', ordernumberSchema)