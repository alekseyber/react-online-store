const {
  sentOrderData,
  getCuponData,
  fetchOrderByIdData,
  returnProductFormData,
  returnCallFormData,
} = require("../controllers_data/order.controller_data");
const { getErrorStatus } = require("../controllers_data/errors.class");

module.exports.sentOrder = async (req, res) => {
  try {
    const rezult = await sentOrderData(req.body, req.ip);
    res.status(201).json(rezult);
  } catch (e) {
    getErrorStatus(e, res);
  }
};

module.exports.getCupon = async (req, res) => {
  try {
    const rezult = await getCuponData(req.query.cupontext);
    res.status(200).json(rezult);
  } catch (e) {
    getErrorStatus(e, res);
  }
};

module.exports.fetchById = async (req, res) => {
  try {
    const rezult = await fetchOrderByIdData(req.params.id);
    res.status(200).json(rezult);
  } catch (e) {
    getErrorStatus(e, res);
  }
};

module.exports.returnProductForm = async (req, res) => {
  try {
    await returnProductFormData(req.body, req.ip);
  } catch (e) {
  } finally {
    res.status(201).send("OK");
  }
};

module.exports.returnCallForm = async (req, res) => {
  try {
    await returnCallFormData(req.body, req.ip);
  } catch (e) {
  } finally {
    res.status(201).send("OK");
  }
};
