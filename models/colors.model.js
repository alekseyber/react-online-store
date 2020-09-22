const { model, Schema } = require('mongoose')
const createAlias = require('../middleware/create-alias');

const colorsSchema = new Schema({
    alias: {
        type: String,
        index: true,
        unique: [true, "Alias должен быть уникальным"],
        default: ""
    },
    title: {
        type: String,
        required: true
    },
    sortvalue: {
        type: Number,
        default: 0,
        index: true
    },
    tags: {
        type: String,
        default: ""
    },
    colorkey: {
        type: String,
        required: true
    },
    children: [{
        aliasitem: {
            type: String,
            index: true,            
            default: ""
        },
        title: {
            type: String,
            required: true
        },
        rustitle: {
            type: String,
            required: true
        },
        sortvalueitem: {
            type: Number,
            default: 0,
            index: true
        },
        search_str: {
            type: String,
            default: ""
        },
        colorkey: {
            type: String,
            required: true
        },

    }]

})

colorsSchema.pre('save', async function (next) {

    try {
        //console.log(this)
        const modelName = 'colors';
        const _id = (this._id !== undefined) ? this._id : '';

        if (this.children !== undefined) {
            const path_attrs = 'children.aliasitem';
            const child_id = true;
            for (const item of this.children) {
                const alias_attrs = item.aliasitem;
                const title_attrs = item.title;
                const _id_attrs = item._id;

                const candidate_attrs = await createAlias(modelName, title_attrs, path_attrs, alias_attrs, _id_attrs, '', child_id);
                if (String(alias_attrs) !== String(candidate_attrs)) {
                    if (candidate_attrs) {
                        item.aliasitem = candidate_attrs;
                    } else {
                        throw new Error('Ошибка генерации Aliasitem, не сохранено.');
                    }
                }
            }
        }
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

colorsSchema.pre('deleteOne', async function (next) {
    try {
        const doc = await this.findOne();
        //console.log('predeleteOne', doc)
        if (doc.children.length) {
            throw new Error('Не возможно удалить группу с дочерними цветами.');
        }
    } catch (e) {
        //console.error(e)
        throw new Error(e.message);
    }
    next();
});


module.exports = model('colors', colorsSchema)