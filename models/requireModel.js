

module.exports = (modelName = "", all = false) => {
    try {
        let models = null;
        if ((modelName && modelName !== undefined) || all) {
            models = require('require-all')({
                dirname: __dirname,
                filter: /(.+model)\.js$/,
                map: function (name, path) {
                    return name.replace(/\.model/g, "");
                }
            });
        }
        if (modelName && modelName !== undefined && !all) {

            modelName = String(modelName);

            if (modelName in models) {
                return models[modelName]
            }
        } else if (all) {
            return models
        }

    } catch (e) {
        console.error(e)
    }
};




