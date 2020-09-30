const {
  getTextReturnProductData,
} = require("../controllers_data/params.controller_data");
const { getErrorStatus } = require("../controllers_data/errors.class");

module.exports.getTextReturnProduct = async (req, res) => {
  try {
    const rezult = await getTextReturnProductData();
    res.status(200).json(rezult);
  } catch (e) {
    getErrorStatus(e, res);
  }
};
