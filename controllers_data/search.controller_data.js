const Indexproduct = require("../models/indexproduct.model");
const Sort = require("../models/sort.model");
const Product = require("../models/product.model");
const { DbError, globalErrorCheck } = require("./errors.class");

const getQuery = (q) => {
  const rezult = {
    preview: "",
    regex: "",
    valid: false,
  };
  if (!q) {
    return rezult;
  }
  if (q.length > 0) {
    q = q.trim().toLowerCase();
    q = q.replace(/[^a-zа-я0-9 ]/g, "");
    q = q.replace(/\s{2,}/g, " ");
    rezult.preview = q;
    let qArr = q.split(" ");
    qArr = qArr.filter((item) => item.length > 1);

    let tempArr = [];
    for (let str of qArr) {
      str = str.trim();
      if (!tempArr.includes(str)) {
        tempArr.push(str);
      }
    }

    tempArr = tempArr.sort();
    if (tempArr.length > 0) {
      rezult.valid = true;
      let regStr = "";
      tempArr.forEach((item) => {
        regStr = regStr + item + ".*";
      });
      regStr = regStr.replace(/\.\*$/, "");
      rezult.regex = new RegExp(regStr);
    }
  }
  return rezult;
};

const getIndexProduct = async ($regex) => {
  try {
    const aggregate = await Indexproduct.aggregate([
      {
        $match: {
          indexStr: {
            $regex,
          },
        },
      },
      {
        $project: {
          _id: 0,
          product_id: 1,
          level: 1,
        },
      },
      { $addFields: { groupselect: "group" } },

      {
        $group: {
          _id: "groupselect",
          product_ids: { $addToSet: "$product_id" },
          colors: { $addToSet: "$level" },
        },
      },
    ]);
    let rezult = {
      status: false,
      products: [],
      colors: [],
      colorsCount: 0,
    };

    if (aggregate.length === 1) {
      const product_ids = aggregate[0].product_ids;

      const sort = await Sort.findOne(
        { sort_default: true },
        { order: 1, field: 1 }
      );
      let sort_obj = {};
      if (sort) {
        sort_obj[sort.field] = sort.order === true ? -1 : 1;
      }
      rezult.products = await Product.find(
        {
          status: true,
          _id: { $in: product_ids },
        },
        { alias: 1 }
      ).sort(sort_obj);

      if (rezult.products) {
        if (!aggregate[0].colors.includes("")) {
          rezult.colors = aggregate[0].colors;
          rezult.colorsCount = rezult.colors.length;
        }
        rezult.status = true;
      }
    }

    return rezult;
  } catch (e) {
    throw new DbError("Ошибка БД getIndexProduct");
  }
};

module.exports.searchListData = async (q) => {
  try {
    const queryParams = getQuery(q);
    const rezult = {
      products: [],
      searchAll: false,
    };

    if (queryParams.valid) {
      const query = {
        indexStr: {
          $regex: queryParams.regex,
        },
      };

      docs = await Indexproduct.find(query, {
        _id: 0,
        product_id: 1,
        title: 1,
        link: 1,
      })
        .sort({ product_id: 1, sortvalue: 1 })
        .limit(1300);
      let product_ids = [];
      for (let doc of docs) {
        if (!product_ids.includes(String(doc.product_id))) {
          product_ids.push(String(doc.product_id));
          const item = {
            title: doc.title,
            link: doc.link,
          };
          rezult.products.push(item);
        }
        if (product_ids.length === 2) {
          rezult.searchAll = "/search"; //encodeURI('/search?q=' + queryParams.preview);
        }
        if (product_ids.length === 10) {
          break;
        }
      }
    }
    return rezult;
  } catch (e) {
    globalErrorCheck(e);
  }
};

module.exports.searchFullData = async (q) => {
  try {
    const queryParams = getQuery(q);
    let rezult = {
      preview: queryParams.preview,
      products: [],
      filter: {
        count: 0,
        selected: {},
      },
    };
    if (queryParams.valid) {
      const indexProduct = await getIndexProduct(queryParams.regex);
      if (indexProduct.status) {
        rezult.products = indexProduct.products;
        if (indexProduct.colorsCount) {
          rezult.filter.count = indexProduct.colorsCount;
          rezult.filter.selected.color = indexProduct.colors;
        }
      }
    }
    return rezult;
  } catch (e) {
    globalErrorCheck(e);
  }
};
