const getModel = require('../models/requireModel');

module.exports = async (modelName, filter = {}) => {
    const rezult = {
        count: 0,
        err: false
    };

    try {
        const Model = getModel(modelName);
        if (!Model) {
            rezult.err = true
        } else {
            if (Object.keys(filter).length > 0) {
                rezult.count = await Model.countDocuments(filter);
            } else {
                rezult.count = await Model.estimatedDocumentCount();
            }

        }

    } catch (e) {
        console.error(e);
        rezult.err = true
    }
    return rezult

};