const { model, Schema } = require('mongoose')

const countervalueSchema = new Schema({

    countValue: {
        type: Number,
        default: 1
    },
    status: {
        type: Boolean,
        default: false
    }

})

countervalueSchema.static('getNumber', async function getNumber() {
    const doc = await this.findOne({ status: true });
    let rezult = 1;
    if (doc) {
        doc.countValue++;
        await doc.save();
        rezult = doc.countValue;
    } else {
        await this.create({ status: true });
    }

    return rezult;
});



module.exports = model('countervalue', countervalueSchema)