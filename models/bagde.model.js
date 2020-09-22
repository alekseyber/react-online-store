const { model, Schema } = require('mongoose')

const bagdeSchema = new Schema({

    title: {
        type: String,
        required: true
    },
    colorkey: {
        type: String,
        default: '131313'
    },
    status: {
        type: Boolean,
        default: true
    }

})

bagdeSchema.pre('deleteOne', async function () {
    throw new Error('Для сохранения целостности, в этой коллекции не возможно удалять.');
    //next();
});
module.exports = model('bagde', bagdeSchema)