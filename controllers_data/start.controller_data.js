const Params = require("../models/params.model");
const Product = require("../models/product.model");
const Category = require("../models/category.model");
const getFilter = require("../middleware/get-filter");
const { getDeliveryMidel } = require("../middleware/delivery");
const { getBrands } = require("../middleware/product-params");
const {
  getColors,
  getSizes,
  getSort,
  getBagdes,
} = require("../middleware/start-data");
const { OtherError, DbError, globalErrorCheck } = require("./errors.class");

const getTree = (data) => {
  let itemsByID = {};
  data.forEach((item) => {
    itemsByID[String(item._id)] = {
      _id: item._id,
      img: item.img,
      title: item.title,
      alias: item.alias,
      parent_id: item.parent_id,
      childs: [],
    };
  });

  let rootKey = "";
  let i = 0;
  for (const item in itemsByID) {
    if (String(itemsByID[item].parent_id) !== String(itemsByID[item]._id)) {
      itemsByID[itemsByID[item].parent_id].childs.push(itemsByID[item]);
    } else {
      rootKey = item;
    }

    i++;
  }
  const roots = itemsByID[rootKey];

  return roots;
};

const getCategoryTree = async () => {
  try {
    const category = await Category.find(
      { status: true },
      { _id: 1, alias: 1, title: 1, img: 1, parent_id: 1 }
    ).sort({ cat_default: -1, sortvalue: 1 });
    if (category.length) {
      return getTree(category);
    }

    throw new OtherError("Категории не найдены, повторите позднее");
  } catch (e) {
    globalErrorCheck(e);
  }
};

const getDeliveryData = async (ip) => {
  try {
    return await getDeliveryMidel(null, ip);
  } catch (e) {
    // console.log(e.message, ip);
    return {
      courier: {},
      pvz: {},
      status: false,
      errMsg: e.message,
      cityid: 44,
      city: {
        id: 44,
        cityName: "Москва",
        oblName: "Москва",
      },
    };
  }
};

const getParamsData = async () => {
  try {
    return await Params.findOne({ select: true }, { _id: 0 });
  } catch (e) {
    throw new DbError(e.message);
  }
};

const getRecomaccesData = async () => {
  try {
    return await Product.find(
      {
        cart_on: true,
        "level1_data.level1_status": true,
        "level1_data.level2.amount": { $gt: 0 },
      },
      { alias: 1 }
    ).limit(2);
  } catch (e) {
    throw new DbError(e.message);
  }
};

const getStartData = async (ip) => {
  try {
    const paramsData = await getParamsData();
    const colorsData = await getColors();
    const sizesData = await getSizes();
    const sortData = await getSort();
    const brandsData = await getBrands();
    const bagdesData = await getBagdes();
    const recomaccesData = await getRecomaccesData();
    const categorytreeData = await getCategoryTree();
    const filterData = await getFilter();
    const deliveryData = await getDeliveryData(ip);

    return {
      paramsData,
      colorsData,
      sizesData,
      sortData,
      brandsData,
      bagdesData,
      recomaccesData,
      categorytreeData,
      filterData,
      deliveryData,
    };
  } catch (e) {
    globalErrorCheck(e);
  }
};

module.exports = {
  getStartData,
  getParamsData,
  getColors,
  getSizes,
  getSort,
  getBrands,
  getBagdes,
  getRecomaccesData,
  getCategoryTree,
  getFilter,
  getDeliveryData,
};
