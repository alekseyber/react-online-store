const { model, Schema } = require('mongoose')
const getCountFormMongo = require('../middleware/get-count-form-mongo');
const setManyMongo = require('../middleware/set-many-mongo');

const acquirerSchema = new Schema({

    phone: {
        type: String,
        index: true,
        unique: [true, "phone должен быть уникальным"],
        required: true
    },
    status_block: {
        type: Boolean,
        default: false
    },
    description: {
        type: String,
        default: ""
    }

})

acquirerSchema.static('findOneOrCreate', async function findOneOrCreate(condition, doc) {
    const one = await this.findOne(condition);

    return one || this.create(condition);
});

acquirerSchema.pre('deleteOne', async function (next) {
    const { _id } = await this.findOne();

    const count = await getCountFormMongo('order', { acquirer_id: _id });
    if (count.count > 0) {
        throw new Error('Не возможно удалить, у этого покупателя есть заказы.');
    }
    next();
});

acquirerSchema.post('save', async function (doc) {

    const $set = {
        acquirer_block: doc.status_block
    }
    await setManyMongo('order', $set, { acquirer_id: doc._id });
    
});


module.exports = model('acquirer', acquirerSchema)