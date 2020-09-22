const { model, Schema } = require('mongoose')
const getCountFormMongo = require('../middleware/get-count-form-mongo');
const createAlias = require('../middleware/create-alias');

const filterSchema = new Schema({
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
    status: {
        type: Boolean,
        default: true,
        index: true
    },
    color: {
        type: Boolean,
        default: false,
    },
    sizes: {
        type: Boolean,
        default: false,
    },
    // delnot: {
    //     type: Boolean,
    //     default: false,
    // },
    // radio: {
    //     type: Boolean,
    //     default: false,
    // },
    cartproduct: {
        type: Boolean,
        default: false,
    },
    filter: {
        type: Boolean,
        default: false,
        index: true
    },
    // old_id: {
    //     type: Number
    // },
    attrs: [{
        alias_attrs: {
            type: String,
            index: true,            
            default: ""
        },
        title: {
            type: String,
            required: true
        },
        tags: {
            type: String,
            default: "",
        },
        status_attr: {
            type: Boolean,
            default: true
        },
        sortvalueitem: {
            type: Number,
            default: 0,
            index: true
        }
    }]
})

filterSchema.pre('save', async function (next) {

    try {
        //console.log(this)
        const modelName = 'filter';
        const _id = (this._id !== undefined) ? this._id : '';
        const fields = ['color', 'sizes'];
        for (const item of fields) {
            if (this[item]) {
                const filter = {};
                filter[item] = true;
                if (_id) {
                    filter._id = { $ne: _id };
                }
                const count = await getCountFormMongo(modelName, filter);

                if (count.count > 0) {
                    throw new Error('Включенный атрибут color или size может быть только для одной группы');
                }
            }
        }

        if (this.attrs !== undefined) {
            const path_attrs = 'attrs.alias_attrs';
            const child_id = true;
            for (const item of this.attrs) {
                const alias_attrs = item.alias_attrs;
                const title_attrs = item.title;
                const _id_attrs = item._id;

                const candidate_attrs = await createAlias(modelName, title_attrs, path_attrs, alias_attrs, _id_attrs, '', child_id);
                if (String(alias_attrs) !== String(candidate_attrs)) {
                    if (candidate_attrs) {
                        item.alias_attrs = candidate_attrs;
                    } else {
                        throw new Error('Ошибка генерации Alias_attrs, не сохранено.');
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

        // if ((this.color || this.sizes) && this.status === false) {
        //     throw new Error('Служебные группы color или sizes не могут быть отключены');
        // }

    } catch (e) {
        console.error(e)
        throw new Error(e.message);
    }
    next();
});


filterSchema.pre('deleteOne', async function (next) {
    try {
        const doc = await this.findOne();
        //console.log('predeleteOne', doc)
        if (doc.color || doc.sizes) {
            throw new Error('Не возможно удалить служебная группа.');
        }

    } catch (e) {
        //console.error(e)
        throw new Error(e.message);
    }
    next();
});


module.exports = model('filter', filterSchema)