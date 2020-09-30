const {
  getCityData,
  getDeliveryData,
  getPvzListData,
} = require("../controllers_data/delivery.controller_data");
const { getErrorStatus } = require("../controllers_data/errors.class");

module.exports.getCity = async (req, res) => {
  try {
    const rezult = await getCityData(req.query.citySaerch);
    res.status(200).json(rezult);
  } catch (e) {
    getErrorStatus(e, res);
  }
};

module.exports.getDelivery = async (req, res) => {
  try {
    const rezult = await getDeliveryData(req.query.cityid, req.ip);
    res.status(200).json(rezult);
  } catch (e) {    
    getErrorStatus(e, res);
  }
};

module.exports.getPvzList = async (req, res) => {
  try {
    const rezult = await getPvzListData(req.query.cityid);
    res.status(200).json(rezult);
  } catch (e) {    
    getErrorStatus(e, res);
  }
};
