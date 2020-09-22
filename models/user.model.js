const { model, Schema } = require('mongoose');
const getCountFormMongo = require('../middleware/get-count-form-mongo');

const userSchema = new Schema({
    login: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true,
        minLength: 8
    },
    status: {
        type: Boolean,
        default: false
    },
    email: {
        type: String,
        required: true
    },
    notes: {
        type: String,
        default: ""
    }
})

// userSchema.pre('findOneAndUpdate', function (next, doc) {

//     //  console.log('findOneAndUpdate', doc, this)
//     next();
// });

userSchema.pre('save', async function (next) {

    if ('status' in this) {
        if (this.status === false) {
            const filter = {
                status: true,
                _id: { $ne: this._id }
            }

            const count = await getCountFormMongo('user', filter);

            if (count.count === 0) {
                throw new Error('Не возможно отключить всех администраторов, Вы не сможете войти.');
            }

        }
    }

    next();
});

userSchema.pre('deleteOne', async function (next) {
    const count = await getCountFormMongo('user');
    if (count.count === 1) {
        throw new Error('Не возможно удалить всех администраторов, Вы не сможете войти.');
    }

    next();
});

module.exports = model('users', userSchema)