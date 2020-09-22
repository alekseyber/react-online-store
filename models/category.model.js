const { model, Schema } = require('mongoose')
const createAlias = require('../middleware/create-alias');
const getModel = require('../models/requireModel');

const categorySchema = new Schema({

    alias: {
        type: String,
        index: true,
        unique: [true, "Alias должен быть уникальным"],
        default: ""
    },
    title: {
        type: String,
        required: [true, "Title должен быть заполненным"]
    },
    htitle: {
        type: String,
        default: ""
    },
    sortvalue: {
        type: Number,
        default: 0,
        index: true
    },
    parent_id: {
        type: Schema.ObjectId,
        ref: "category"
    },
    img: {
        type: String,
        default: "no_image.jpg"
    },
    smimg: {
        type: String,
        default: "no_image.jpg"
    },
    cat_default: {
        type: Boolean,
        default: false
    },
    main_page: {
        type: Boolean,
        default: false
    },
    status: {
        type: Boolean,
        default: true
    },
    promo: {
        type: String,
        default: ""
    },
    content: {
        type: String,
        default: ""
    },
    meta: {
        title: {
            type: String,
            default: ""
        },
        description: {
            type: String,
            default: ""
        },
        keywords: {
            type: String,
            default: ""
        }
    },
},
    {
        timestamps: { createdAt: 'createdAt' },
        timestamps: { updatedAt: 'update_at' }
    }
);

categorySchema.index({ update_at: 1, type: -1 });

categorySchema.pre('save', async function (next) {

    try {
        const modelName = 'category';

        if (this.alias !== undefined) {

            const alias = this.alias;
            const title = ('title' in this) ? this.title : '';
            const _id = (this._id !== undefined) ? this._id : '';
            const path = 'alias';
            const addStr = '';
            const candidate = await createAlias(modelName, title, path, alias, _id, addStr);
            if (String(alias) !== String(candidate)) {
                if (candidate) {
                    this.alias = candidate;
                } else {
                    throw new Error('Ошибка генерации Alias, не сохранено.');
                }
            }
        }
        if (this.parent_id !== undefined) {
            if (String(this.parent_id) === String(this._id)) {

                const Category = getModel('category');
                const filter = {
                    _id: { $ne: this._id },
                    $expr: { $eq: ["$_id", "$parent_id"] }
                }
                const countDocuments = await Category.find(filter).countDocuments();
                //console.log(countDocuments);                
                if (countDocuments) {
                    throw new Error('Не возможно создать боле одной категории верхнего уровня.');
                }
            }
        }

    } catch (e) {
        console.error(e.message)
        throw new Error(e.message);
    }
    next();
});

module.exports = model('category', categorySchema)