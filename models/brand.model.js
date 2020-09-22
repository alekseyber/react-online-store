const { model, Schema } = require('mongoose')

const brandSchema = new Schema({

    title: {
        type: String,
        required: true
    },
    img: {
        type: String,
        required: true
    },
    sortvalue: {
        type: Number,
        default: 0,
        index: true
    },
    description: {
        type: String,
        default: ""
    },
    content: {
        type: String,
        default: ""
    },
    search_str: {
        type: String,
        default: ""
    }
})


brandSchema.pre('deleteOne', async function () {
    throw new Error('Для сохранения целостности, в этой коллекции не возможно удалять.');
    //next();
});

module.exports = model('brand', brandSchema)