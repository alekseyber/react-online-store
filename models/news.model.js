const { model, Schema } = require('mongoose')
const createAlias = require('../middleware/create-alias');

const newsSchema = new Schema({

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
    img: {
        type: String,
        default: "no_image.jpg"
    },
    status: {
        type: Boolean,
        default: true
    },
    wtitle: {
        type: Boolean,
        default: false
    },
    annonce: {
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
    }

},
    {
        timestamps: { createdAt: 'createdAt' },
        timestamps: { updatedAt: 'update_at' }
    }
);

newsSchema.index({ update_at: 1, type: -1 });

newsSchema.pre('save', async function (next) {

    try {
        const modelName = 'news';

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

    } catch (e) {
        console.error(e)
        throw new Error(e.message);
    }
    next();
});

module.exports = model('news', newsSchema)