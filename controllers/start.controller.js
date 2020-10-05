const {
  getStartData,
  getTextReturnProduct,
  getStartTest,
} = require("../controllers_data/start.controller_data");
const { getErrorStatus } = require("../controllers_data/errors.class");

module.exports.getStart = async (req, res) => {
  try {
    const rezult = await getStartData(req.ip);
    res.status(200).json(rezult);
  } catch (e) {
    getErrorStatus(e, res);
  }
};

module.exports.getStartTest = async (req, res) => {
  try {
    const rezult = await getStartTest(req.ip);
    res.status(200).json(rezult);
  } catch (e) {
    getErrorStatus(e, res);
  }
};

module.exports.getTextReturn = async (_, res) => {
  try {
    const rezult = await getTextReturnProduct();
    res.status(200).json(rezult);
  } catch (e) {
    getErrorStatus(e, res);
  }
};
