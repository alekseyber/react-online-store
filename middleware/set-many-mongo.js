const getModel = require('../models/requireModel');

module.exports = async (modelName, $set = {}, filter = {}) => {
    const rezult = true;

    try {
        const Model = getModel(modelName);
        if (!Model) {
            rezult = false
        } else {
            await Model.updateMany(filter, { $set });
        }

    } catch (e) {
        console.error(e.message);
        rezult = false
    }
    return rezult

};