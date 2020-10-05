const {
  getAllNewsData,
  getNewsByAliasData,
} = require("../controllers_data/news.controller_data");
const { getErrorStatus } = require("../controllers_data/errors.class");

module.exports.getAll = async (_, res) => {
  try {
    const docs = await getAllNewsData();

    res.status(200).json(docs);
  } catch (e) {
    getErrorStatus(e, res);
  }
};

module.exports.getByAlias = async (req, res) => {
  try {
    const rezult = await getNewsByAliasData(req.params.alias);
    res.status(200).json(rezult);
  } catch (e) {
    getErrorStatus(e, res);
  }
};
