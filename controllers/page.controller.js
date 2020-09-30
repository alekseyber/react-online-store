const {
  getPageByAlias,
  getOfertaData,
  getSizesChartData,
} = require("../controllers_data/page.controller_data.js");

const { getErrorStatus } = require("../controllers_data/errors.class");

module.exports.getByAlias = async (req, res) => {
  try {
    const rezult = await getPageByAlias(req.params.alias);
    res.status(200).json(rezult);
  } catch (e) {
    getErrorStatus(e, res);
  }
};

module.exports.getOferta = async (req, res) => {
  try {
    const rezult = await getOfertaData();
    res.status(200).json(rezult);
  } catch (e) {
    getErrorStatus(e, res);
  }
};

module.exports.getSizesChart = async (req, res) => {
  try {
    const rezult = await getSizesChartData(req.params.id);
    res.status(200).json(rezult);
  } catch (e) {
    getErrorStatus(e, res);
  }
};
