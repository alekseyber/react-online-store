const {
  getAllData,
  getByAliasData,
} = require("../controllers_data/news.controller_data");
const { getErrorStatus } = require("../controllers_data/errors.class");

module.exports.getAll = async (req, res) => {
  try {
    const docs = await getAllData();

    res.status(200).json(docs);
  } catch (e) {
    getErrorStatus(e, res);
  }
};

module.exports.getByAlias = async (req, res) => {
  try {
    const rezult = await getByAliasData(req.params.alias);
    res.status(200).json(rezult);
  } catch (e) {
    getErrorStatus(e, res);
  }
};
