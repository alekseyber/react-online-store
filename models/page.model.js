const createAlias = require('../middleware/create-alias');
const getCountFormMongo = require('../middleware/get-count-form-mongo');
const { model, Schema } = require('mongoose');


const pageSchema = new Schema({

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
    status: {
        type: Boolean,
        default: true
    },
    content: {
        type: String,
        default: ""
    },
    oferta: {
        type: Boolean,
        default: false
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

pageSchema.index({ update_at: 1, type: -1 });

pageSchema.pre('save', async function (next) {

    try {
        const modelName = 'page';
        const _id = (this._id !== undefined) ? this._id : '';
        
        if (this.oferta !== undefined) {
            if (this.oferta) {
                const filter = {
                    oferta: true
                }
                if (_id) {
                    filter._id = { $ne: _id };
                }
                const count = await getCountFormMongo(modelName, filter);

                if (count.count > 0) {
                    throw new Error('Документы оферта не может быть более одного.');
                }

            }
        }

        if (this.alias !== undefined) {

            const alias = this.alias;
            const title = ('title' in this) ? this.title : '';
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


module.exports = model('page', pageSchema)