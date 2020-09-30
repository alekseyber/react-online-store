const { getStartData } = require("../controllers_data/start.controller_data");
const { getErrorStatus } = require("../controllers_data/errors.class");

module.exports.getStart = async (req, res) => {
  try {
    const rezult = await getStartData(req.ip);
    res.status(200).json(rezult);
  } catch (e) {
    getErrorStatus(e, res);
  }
};
