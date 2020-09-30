const { getErrorStatus } = require("../controllers_data/errors.class");
const {
  searchListData,
  searchFullData,
} = require("../controllers_data/search.controller_data");

module.exports.searchList = async (req, res) => {
  try {
    const rezult = await searchListData(req.query.q);
    res.status(200).json(rezult);
  } catch (e) {
    getErrorStatus(e, res);
  }
};

module.exports.searchFull = async (req, res) => {
  try {
    const rezult = await searchFullData(req.query.q);
    res.status(200).json(rezult);
  } catch (e) {
    getErrorStatus(e, res);
  }
};
