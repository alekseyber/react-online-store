const {
  getProductsForCategoryData,
} = require("../controllers_data/category.controller_data");
const { getErrorStatus } = require("../controllers_data/errors.class");

module.exports.getProductsForCategory = async (req, res) => {
  try {
    const rezult = await getProductsForCategoryData(
      req.params.alias,
      req.query.sortValue
    );
    res.status(200).json(rezult);
  } catch (e) {
    getErrorStatus(e, res);
  }
};
