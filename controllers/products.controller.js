const {
  getProductByAliasData,
  getProductsByIdsData,
  getProductsHitData,
  getProductContentData,
  getProductByLevelTooData,
} = require("../controllers_data/products.controller_data.js");

const { getErrorStatus } = require("../controllers_data/errors.class");

module.exports.getProductByAlias = async (req, res) => {
  try {
    const rezult = await getProductByAliasData(req.params.alias);
    res.status(200).json(rezult);
  } catch (e) {
    getErrorStatus(e, res);
  }
};

module.exports.getProductsByIds = async (req, res) => {
  try {
    const rezult = await getProductsByIdsData(req.query.ids, req.query.byalias);
    res.status(200).json(rezult);
  } catch (e) {
    getErrorStatus(e, res);
  }
};

module.exports.getProductsHit = async (req, res) => {
  try {
    const rezult = await getProductsHitData(req.query.countHits);
    res.status(200).json(rezult);
  } catch (e) {
    getErrorStatus(e, res);
  }
};

module.exports.getProductContent = async (req, res) => {
  try {
    const rezult = await getProductContentData(req.params.alias);
    res.status(200).json(rezult);
  } catch (e) {
    getErrorStatus(e, res);
  }
};

module.exports.getProductByLevelToo = async (req, res) => {
  try {
    const rezult = await getProductByLevelTooData(req.params.id);
    res.status(200).json(rezult);
  } catch (e) {
    getErrorStatus(e, res);
  }
};
