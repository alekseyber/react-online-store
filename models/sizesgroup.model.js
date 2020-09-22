const { model, Schema } = require('mongoose');
const getCountFormMongo = require('../middleware/get-count-form-mongo');

const sizesgroupSchema = new Schema({

    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        default: ""
    },
    nosize: {
        type: Boolean,
        default: false
    },
    age: {
        type: String,
        default: "взрослый",
        enum: ['для малышей', 'детский', 'взрослый'],
    },
    gender: {
        type: String,
        default: "для женщин",
        enum: ['унисекс', 'для женщин', 'для мужчин', 'для девочек', 'для мальчиков'],
    },
    unit: {
        type: String,
        default: "RU",
        enum: ['RU', 'INT', 'EU', 'DE', 'AU', 'FR', 'Japan', 'IT', 'UK', 'US'],
    },
})

sizesgroupSchema.pre('save', async function (next) {

    if ('nosize' in this) {
        if (this.nosize === false) {
            const filter = {
                nosize: true,
                _id: { $ne: this._id }
            }

            const count = await getCountFormMongo('sizesgroup', filter);

            if (count.count === 0) {
                throw new Error('Не может быть больше одного не размера.');
            }

        }
    }

    next();
});


sizesgroupSchema.pre('deleteOne', async function () {
    throw new Error('Для сохранения целостности, в этой коллекции не возможно удалять.');
    //next();
});

module.exports = model('sizesgroup', sizesgroupSchema)