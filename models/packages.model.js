const { model, Schema } = require('mongoose')

const packagesSchema = new Schema({

    title: {
        type: String,
        required: true
    },
    weight: { //Общий вес (в граммах)
        type: Number,
        required: true
    },
    length: { //Длина (в сантиметрах)
        type: Number,
        required: true
    },
    width: { //Ширина (в сантиметрах)
        type: Number,
        required: true
    },
    height: { //Высота (в сантиметрах)
        type: Number,
        required: true
    }

})

packagesSchema.pre('deleteOne', async function () {
    throw new Error('Не возможно удалить из этой таблицы.');
    // next();
});

module.exports = model('packages', packagesSchema)