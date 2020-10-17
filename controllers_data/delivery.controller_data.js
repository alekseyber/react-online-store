const {
  getCityMidel,
  getDeliveryMidel,
  getPvzListMidel,
} = require("../middleware/delivery");

const { getPvzListByCityId } = require("../middleware/service-cdek");
const { NotFoundError, DeliveryError } = require("./errors.class");

module.exports.getCityData = async (citySaerch) => {
  try {
    return await getCityMidel(citySaerch);
  } catch (e) {
    //console.error(e.message);
    throw new DeliveryError(e.message);
  }
};

module.exports.getDeliveryData = async (cityid, ip, start = false) => {
  try {
    const rezult = await getDeliveryMidel(cityid, ip, start);
    if (start) {
      return {
        city: rezult,
      };
    }
    return rezult;
  } catch (e) {
    if (!start || cityid) {
      throw new DeliveryError(e.message);
    }
    return {
      cityid: 44,
      courier: null,
      pvz: null,
      status: false,
      errMsg: e.message,
      city: {
        id: 44,
        cityName: "Москва",
        oblName: "Москва",
      },
    };
  }
};

module.exports.getPvzListV2 = async (cityid) => {
  try {
    const list = await getPvzListByCityId(cityid);

    return { cityid, list };
  } catch (e) {
    //console.error(e.message);
    throw new NotFoundError(e.message);
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
