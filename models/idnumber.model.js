const { model, Schema } = require('mongoose')
const Countervalue = require('../models/countervalue.model');


const idnumberSchema = new Schema({

    idNumber: {
        type: Number,
        required: true,
        unique: true
    },
    idMongo: {
        type: String,
        required: true,
        index: true,
        unique: true
    }

})

idnumberSchema.static('findOneOrCreate', async function findOneOrCreate(idMongo) {

    idMongo = String(idMongo);

    const one = await this.findOne({ idMongo }, { _id: 0, idNumber: 1 });

    if (one) {
        return one.idNumber
    }
    const idNumber = await Countervalue.getNumber();
    await this.create({
        idNumber, idMongo
    });
    return idNumber;
});


module.exports = model('idnumber', idnumberSchema)