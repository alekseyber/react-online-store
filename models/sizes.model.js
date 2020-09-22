const { model, Schema } = require('mongoose')
const sizesgroup = require('../models/sizesgroup.model')
const createAlias = require('../middleware/create-alias');

const sizesSchema = new Schema({
    alias: {
        type: String,
        unique: [true, "Alias должен быть уникальным"],
        default: ""
    },
    title: {
        type: String,
        required: true
    },
    sortvalue: {
        type: Number,
        default: 0
    },
    description: {
        type: String,
        default: ""
    },
    search_str: {
        type: String,
        default: ""
    },
    rudop: {
        type: String,
        default: ""
    },
    tags: {
        type: String,
        default: ""
    },
    nosize: {
        type: Boolean,
        default: false
    },
    unitvalue: {
        type: String,
        default: ""
    },
    group: [{ type: Schema.ObjectId, ref: sizesgroup }]

});

sizesSchema.index({ sortvalue: 1 });

sizesSchema.pre('save', async function (next) {

    try {
        //console.log(this)
        const modelName = 'sizes';
        const _id = (this._id !== undefined) ? this._id : '';

        if (this.alias !== undefined) {
            const alias = this.alias;
            const title = ('title' in this) ? this.title : '';
            const path = 'alias';
            const candidate = await createAlias(modelName, title, path, alias, _id);
            if (String(alias) !== String(candidate)) {
                if (candidate) {
                    this.alias = candidate;
                } else {
                    throw new Error('Ошибка генерации Alias, не сохранено.');
                }
            }
        }

    } catch (e) {
        console.error(e)
        throw new Error(e.message);
    }
    next();
});

sizesSchema.pre('deleteOne', async function () {
    throw new Error('Для сохранения целостности, в этой коллекции не возможно удалять.');
    //next();
});
module.exports = model('sizes', sizesSchema)