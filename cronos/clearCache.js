const Cache = require('../models/cache.model')


module.exports = async () => {
    try {
        const res = await Cache.deleteMany({});
        //console.log('deleteMany', res)
        const message = `Кеш очищен успешно, существовало ${res.deletedCount}`;
        return {
            status: 200,
            message
        }

    } catch (e) {
        // console.error(e);        
        throw e
    }
};