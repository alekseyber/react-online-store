const Product = require("../models/product.model");
const Bparams = require("../models/bparams.model");
const Cache = require("../models/cache.model");
const applyPattern = require("../middleware/apply-pattern");
const { getProductPatternData } = require("../middleware/product-params");
const getParrentCategory = require("../middleware/get-parrent-category");
const md5 = require("js-md5");
const { Types } = require("mongoose");
const { NotFoundError, globalErrorCheck } = require("./errors.class");

class ProductItem {
  constructor(data) {
    this.title = data.title;
    this.alias = data.alias;
    this.product_model = data.product_model;
    this.sku = data.sku;
    this.price = data.price;
    this.old_price = data.old_price;
    this.sizesgroup_id = data.sizesgroup_id;
    this.brand_id = data.brand_id;
    this.gender = data.gender;
    this.color_default = data.color_default;
    //this.color_default_base = data.color_default;
    this.level1 = data.level1;
    this._id = data._id;
  }
}

module.exports.getProductByAliasData = async (alias) => {
  try {
    const doc = await Product.findOne(
      { alias },
      {
        alias: 1,
        title: 1,
        product_model: 1,
        sku: 1,
        price: 1,
        old_price: 1,
        sizesgroup_id: 1,
        brand_id: 1,
        gender: 1,
        color_default: 1,
        level1_data: 1,
      }
    );
    if (!doc) {
      throw new NotFoundError("Продукт не найден");
    }
    // const rezult = {};
    // rezult[alias] = new ProductItem(doc);

    return new ProductItem(doc);
  } catch (e) {
    globalErrorCheck(e);
  }
};

module.exports.getProductsByIdsData = async (
  idsInput,
  byalias,
  notObj = false
) => {
  const idsString = String(idsInput);
  const ids = idsString.split(",");

  const where = {};
  if (byalias) {
    where.alias = { $in: ids };
  } else {
    where._id = { $in: ids };
  }

  // const ids = ['5d767189576f11368c679827', '5d767189576f11368c679888', '5d767189576f11368c6798b9']
  try {
    if (Array.isArray(ids) && ids.length > 0) {
      const docs = await Product.find(where, {
        alias: 1,
        title: 1,
        product_model: 1,
        sku: 1,
        price: 1,
        old_price: 1,
        sizesgroup_id: 1,
        brand_id: 1,
        gender: 1,
        color_default: 1,
        //  filter: 1,
        level1_data: 1,
      });

      if (notObj) {
        return docs;
      }

      const products = {};

      docs.forEach((item) => {
        products[item.alias] = new ProductItem(item);
      });
      return products;
    } else {
      return {};
    }
  } catch (e) {
    globalErrorCheck(e);
  }
};

module.exports.getProductsHitData = async (countHitsInput) => {
  try {
    let countHits = 8;
    const countHitsInputNumber = Number(countHitsInput);
    if (!isNaN(countHitsInputNumber)) {
      if (countHitsInputNumber <= 16) {
        countHits = countHitsInputNumber;
      }
    }

    const aggregate = await Product.aggregate([
      { $match: { status: true, hit: true } },
      {
        $project: {
          alias: 1,
          level1_data: {
            $filter: {
              input: "$level1_data",
              as: "level1",
              cond: { $eq: ["$$level1.level1_status", true] },
            },
          },
        },
      },
      { $unwind: "$level1_data" },
      {
        $project: {
          level2: "$level1_data.level2",
          _id: "$_id",
          alias: "$alias",
        },
      },
      { $unwind: "$level2" },
      {
        $project: {
          amount: "$level2.amount",
          _id: "$_id",
          alias: "$alias",
        },
      },
      { $match: { amount: { $ne: 0 } } },
      { $group: { _id: "$_id", alias: { $first: "$alias" } } },
      { $sample: { size: countHits } },
    ]);
    return aggregate;
  } catch (e) {
    globalErrorCheck(e);
  }
};

module.exports.getProductContentData = async (alias) => {
  try {
    const cacheKey = md5("productmain_" + alias);

    const cacheDataRezult = await Cache.findOne(
      { cacheKey },
      { _id: 0, cacheData: 1 }
    );

    if (cacheDataRezult) {
      return cacheDataRezult.cacheData;
    }

    const doc = await Product.findOne(
      { alias },
      {
        _id: 0,
        meta: 1,
        category_id: 1,
        content: 1,
        level1_data: 1,
        title: 1,
        price: 1,
        old_price: 1,
        gender: 1,
        brand_id: 1,
        sku: 1,
        filter: 1,
        related_id: 1,
      }
    ).populate({ path: "related_id", select: { _id: 0, alias: 1 } });
    if (doc) {
      const rezult = {};
      rezult.meta = doc.meta;
      rezult.content = doc.content;
      rezult.level1 = doc.level1_gal;
      rezult.related = "";
      if (doc.related_id) {
        rezult.related = doc.related_id.alias;
      }
      let breadcrumbsparrent = await getParrentCategory(doc.category_id);
      if (breadcrumbsparrent.length > 0) {
        breadcrumbsparrent = breadcrumbsparrent.reverse();
        const iterator = breadcrumbsparrent.keys();
        for (let key of iterator) {
          breadcrumbsparrent[key]["level"] = key + 2;
        }
      }
      rezult.breadcrumbsparrent = breadcrumbsparrent;
      const bparams = await Bparams.findOne(
        { select: true },
        { _id: 0, product_meta: 1, currSymbol: 1 }
      );
      if (
        rezult.meta.title.length === 0 ||
        rezult.meta.description.length === 0
      ) {
        if (rezult.meta.title.length === 0) {
          rezult.meta.title = bparams.product_meta.title;
        }
        if (rezult.meta.description.length === 0) {
          rezult.meta.description = bparams.product_meta.description;
        }
        if (rezult.meta.keywords.length === 0) {
          rezult.meta.keywords = bparams.product_meta.keywords;
        }
      }
      let contData = {};
      contData["meta_title"] = rezult.meta.title;
      contData["meta_description"] = rezult.meta.description;
      contData["meta_keywords"] = rezult.meta.keywords;
      contData["content"] = rezult.content;

      const currSymbol = bparams.currSymbol;
      const level1 = rezult.level1;

      const { patternData, filterData } = await getProductPatternData(
        doc,
        level1,
        currSymbol
      );
      rezult.filter = filterData;

      contData = await applyPattern(contData, patternData);
      rezult.meta.title = contData["meta_title"];
      rezult.meta.description = contData["meta_description"];
      rezult.meta.keywords = contData["meta_keywords"];
      rezult.content = contData["content"];
      const cacheAction = "product";
      const cacheData = rezult;
      const сache = new Cache({ cacheKey, cacheData, cacheAction });
      сache.save();
      return rezult;
    }
    throw new NotFoundError("Продукт не найден");
  } catch (e) {
    globalErrorCheck(e);
  }
};

module.exports.getProductByLevelTooData = async (id) => {
  try {
    const level2_id = Types.ObjectId(id);
    const product = await Product.findOne(
      { "level1_data.level2._id": level2_id, status: true },
      { alias: 1, price: 1, "level1_data.level2.$": 1 }
    );

    if (product) {
      if (product.level1_data[0].level1_status) {
        const level2 = product.level1_data[0].level2.find(
          (item) => String(item._id) === String(level2_id)
        );
        const level_price = product.level1_data[0].price;
        const price = level_price ? level_price : product.price;
        if (level2.amount > 0) {
          const rezult = {
            alias: product.alias,
            color: product.level1_data[0].level1_alias,
            sizes: level2.level2_alias,
            price,
          };
          return rezult;
        }
      }
    }

    throw new NotFoundError("Продукт не найден");
  } catch (e) {
    globalErrorCheck(e);
  }
};
