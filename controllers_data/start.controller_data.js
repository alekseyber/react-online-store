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
const { OtherError, globalErrorCheck } = require("./errors.class");

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

module.exports.getStartData = async (ip) => {
  try {
    const paramsData = await Params.findOne({ select: true }, { _id: 0 });
    const colorsData = await getColors();
    const sizesData = await getSizes();
    const sortData = await getSort();
    const brandsData = await getBrands();
    const bagdesData = await getBagdes();
    const recomaccesData = await Product.find(
      {
        cart_on: true,
        "level1_data.level1_status": true,
        "level1_data.level2.amount": { $gt: 0 },
      },
      { alias: 1 }
    ).limit(2);
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
