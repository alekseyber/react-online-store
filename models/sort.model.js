const { model, Schema } = require('mongoose')
const setManyMongo = require('../middleware/set-many-mongo');

const sortSchema = new Schema({

    text: {
        type: String,
        required: true
    },
    field: {
        type: String,
        required: true
    },
    order: {
        type: Boolean,
        default: false
    },
    sortvalue: {
        type: Number,
        default: 0,
        index: true
    },
    sort_default: {
        type: Boolean,
        default: false,
    }
})


sortSchema.pre('save', async function (next) {

    if ('sort_default' in this) {
        if (this.sort_default === true) {
            const $set = {
                sort_default: false
            }

            const filter = {
                sort_default: true,
                _id: { $ne: this._id }
            }

            const rezult = await setManyMongo('sort', $set, filter);
            if (!rezult) {
                throw new Error('Ошибка обновления, повторите операцию позже.');
            }
        }
    }

    next();
});

sortSchema.pre('deleteOne', async function () {

    throw new Error('Не возможно удалить из этой таблицы.');

    // next();
});

module.exports = model('sort', sortSchema)