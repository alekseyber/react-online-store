const {
  getMainPageData,
} = require("../controllers_data/mainpage.controller_data");
const { getErrorStatus } = require("../controllers_data/errors.class");

module.exports.getMainPage = async (req, res) => {
  try {
    const rezult = await getMainPageData();
    res.status(200).json(rezult);
  } catch (e) {
    getErrorStatus(e, res);
  }
};
