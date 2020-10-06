const Params = require("../models/params.model");
const Product = require("../models/product.model");
const Category = require("../models/category.model");

const Сolor = require("../models/colors.model");
const Sizes = require("../models/sizes.model");
const Brand = require("../models/brand.model");
const Bagde = require("../models/bagde.model");
const Bparams = require("../models/bparams.model");

const { getFilter } = require("../middleware/get-filter");
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

const getDeliveryData = async (cityid = 0, ip) => {
  try {
    return await getDeliveryMidel(cityid, ip);
  } catch (e) {
    // console.log(e.message, ip);
    if (cityid) {
      return globalErrorCheck(e);
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

const getParamsData = async () => {
  try {
    return await Params.findOne({ select: true });
  } catch (e) {
    throw new DbError(e.message);
  }
};

const getRecomaccesData = async (arr = false) => {
  try {
    const docs = await Product.find(
      {
        cart_on: true,
        "level1_data.level1_status": true,
        "level1_data.level2.amount": { $gt: 0 },
      },
      { alias: 1 }
    ).limit(2);
    if (arr) {
      const data = {
        list: docs.map((el) => el.alias),
      };
      return data;
    }
    return docs;
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
    const deliveryData = await getDeliveryData(0, ip);

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

const getColorGrupp = async (alias) => {
  try {
    let config = [
      {
        $project: {
          alias: 1,
          title: 1,
          sortvalue: 1,
          tags: 1,
          colorkey: 1,
          children: 1,
        },
      },
      { $sort: { sortvalue: 1 } },
      { $unwind: "$children" },
      {
        $project: {
          alias: "$alias",
          title: "$title",
          sortvalue: "$sortvalue",
          tags: "$tags",
          colorkey: "$colorkey",
          aliasitem: "$children.aliasitem",
        },
      },
      {
        $group: {
          _id: "$_id",
          alias: { $first: "$alias" },
          title: { $first: "$title" },
          sortvalue: { $first: "$sortvalue" },
          tags: { $first: "$tags" },
          colorkey: { $first: "$colorkey" },
          children: { $addToSet: "$aliasitem" },
        },
      },
      {
        $project: {
          _id: 0,
          alias: "$alias",
          title: "$title",
          sortvalue: "$sortvalue",
          tags: "$tags",
          colorkey: "$colorkey",
          children: "$children",
        },
      },
    ];

    if (alias) {
      config = [{ $match: { alias } }, ...config];
    }

    const rezult = await Сolor.aggregate(config);

    if (alias) {
      return rezult[0] || null;
    }
    return rezult;
  } catch (e) {
    DbError(e.message);
  }
};

const getColor = async (alias) => {
  try {
    if (alias) {
      const doc = await Сolor.findOne(
        { "children.aliasitem": alias },
        { _id: 0, "children.$[0]": 1 }
      );
      if (doc) {
        return {
          alias: doc.children[0].aliasitem,
          title: doc.children[0].title,
          rustitle: doc.children[0].rustitle,
          colorkey: doc.children[0].colorkey,
        };
      }
      return null;
    }

    const config = [
      {
        $project: {
          _id: 0,
          children: 1,
        },
      },

      { $unwind: "$children" },
      {
        $project: {
          alias: "$children.aliasitem",
          title: "$children.title",
          rustitle: "$children.rustitle",
          colorkey: "$children.colorkey",
        },
      },
    ];

    return await Сolor.aggregate(config);
  } catch (e) {
    DbError(e.message);
  }
};

const getSize = async (alias) => {
  try {
    const $project = {
      _id: 0,
      alias: 1,
      title: 1,
      tags: 1,
    };
    if (alias) {
      return await Sizes.findOne({ alias }, $project);
    }
    return await Sizes.find({ nosize: false }, $project).sort({ sortvalue: 1 });
  } catch (e) {
    DbError(e.message);
  }
};

const getBrand = async (_id) => {
  try {
    const $project = { title: 1, img: 1 };
    if (_id) {
      return await Brand.findById(_id, $project);
    }
    return await Brand.find({}, $project).sort({ sortvalue: 1 });
  } catch (e) {
    DbError(e.message);
  }
};

const getBagde = async (_id) => {
  try {
    const $project = {
      title: 1,
      colorkey: 1,
    };
    if (_id) {
      return await Bagde.findOne({ _id, status: true }, $project);
    }
    return await Bagde.find({ status: true }, $project);
  } catch (e) {
    DbError(e.message);
  }
};

const getTextReturnProduct = async () => {
  try {
    const $project = { _id: 0, textReturnProduct: 1 };
    const rezult = {
      content: "",
    };
    const doc = await Bparams.findOne({ select: true }, $project);
    if (doc) {
      rezult.content = doc.textReturnProduct;
    }
    return rezult;
  } catch (e) {
    globalErrorCheck(e);
  }
};

const getStartTest = async (ip) => {
  try {
    // const paramsData = await getParamsData();
    // const colorsData = await getColors();
    // const sizesData = await getSizes();
    // const sortData = await getSort();
    // const brandsData = await getBrands();
    // const bagdesData = await getBagdes();
    // const recomaccesData = await getRecomaccesData();
    // const categorytreeData = await getCategoryTree();
    // const filterData = await getFilter();
    // const deliveryData = await getDeliveryData("85.26.233.40");
    // getProductByAliasData,
    // getProductsByIdsData,
    // getProductsHitData,
    // getProductContentData,
    // getProductByLevelTooData,
    //jeremy-scott-polusapogi
    //classic-mini-ii-polusapogi
    //fetchOrderByIdData('5e56c83a10f15016c4dc7eff')

    // return await getCuponData("test1234");
    return {};
  } catch (e) {
    globalErrorCheck(e);
  }
};

module.exports = {
  getStartData,
  getParamsData,
  getColorGrupp,
  getColor,
  getSize,
  getSort,
  getBrand,
  getBagde,
  getRecomaccesData,
  getCategoryTree,
  getFilter,
  getTextReturnProduct,
  getStartTest,
};
