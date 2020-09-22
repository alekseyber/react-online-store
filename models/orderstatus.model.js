const { model, Schema } = require('mongoose')
const setManyMongo = require('../middleware/set-many-mongo');
const orderstatusSchema = new Schema({

    title: {
        type: String,
        required: true
    },
    sortvalue: {
        type: Number,
        default: 0,
        index: true
    },
    newstatus: {
        type: Boolean,
        default: false
    },
    spendstatus: {
        type: Boolean,
        default: false
    },
    divelerystatus: {
        type: Boolean,
        default: false
    }
})

orderstatusSchema.pre('save', async function (next) {

    const fields = ["newstatus", "spendstatus", "divelerystatus"];
    for (const field of fields) {
        if (field in this) {
            if (this[field] === true) {
                const $set = {};
                $set[field] = false;
                const filter = {
                    _id: { $ne: this._id }
                }
                filter[field] = true;
                const rezult = await setManyMongo('orderstatus', $set, filter);
                if (!rezult) {
                    throw new Error('Ошибка обновления, повторите операцию позже.');
                }
            }
        }
    }

    next();
});

module.exports = model('orderstatus', orderstatusSchema)