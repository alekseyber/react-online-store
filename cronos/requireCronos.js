

module.exports = (work) => {

    try {

        if (work) {
            const works = require('require-all')({
                dirname: __dirname,
                filter: /^.+\.js$/
            });
            //console.log(works)
            const name = work+'.js';
            if (name in works) {
                return works[name]
            }

            return null
        }

    } catch (e) {
        throw e
    }
};




