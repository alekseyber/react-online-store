const {
  getCityMidel,
  getDeliveryMidel,
  getPvzListMidel,
} = require("../middleware/delivery");
const { NotFoundError, DeliveryError } = require("./errors.class");

module.exports.getCityData = async (citySaerch) => {
  try {
    return await getCityMidel(citySaerch);
  } catch (e) {
    //console.error(e.message);
    throw new DeliveryError(e.message);
  }
};

module.exports.getDeliveryData = async (cityid, ip) => {
  try {
    return await getDeliveryMidel(cityid, ip);
  } catch (e) {
    //console.error(e.message);
    throw new DeliveryError(e.message);
  }
};

module.exports.getPvzListData = async (cityid) => {
  try {
    return await getPvzListMidel(cityid);
  } catch (e) {
    //console.error(e.message);
    throw new NotFoundError(e.message);
  }
};
