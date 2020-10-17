const Category = require("../models/category.model");
const Product = require("../models/product.model");
const Sort = require("../models/sort.model");
const applyPattern = require("../middleware/apply-pattern");
const getParrentCategory = require("../middleware/get-parrent-category");
const { NotFoundError, globalErrorCheck, DbError } = require("./errors.class");

const getSortObj = async (sortValueInput) => {
  try {
    const protection = { order: 1, field: 1 };
    const rezult = {
      sortValue: "not",
      sortObj: {},
    };
    if (sortValueInput) {
      const sort = await Sort.findById(sortValueInput, protection);
      if (sort) {
        rezult.sortValue = String(sort._id);
        rezult.sortObj[sort.field] = sort.order ? -1 : 1;
        return rezult;
      }
    }

    const sortDefault = await Sort.findOne({ sort_default: true }, protection);
    if (sortDefault) {
      rezult.sortValue = String(sortDefault._id);
      rezult.sortObj[sortDefault.field] = sortDefault.order ? -1 : 1;
    }
    return rezult;
  } catch (e) {
    throw new DbError("Ошибка обаботки сотировки");
  }
};

const getQweryProducts = (categoryIds = [], all = false, status = true) => {
  const qwery = {};

  if (status) {
    qwery.status = true;
    qwery["level1_data.level2.amount"] = { $gt: 0 };
    qwery["level1_data.level1_status"] = true;
  }

  if (!all) {
    qwery.category_ids = { $in: categoryIds };
  }
  return qwery;
};

const getChildrenCategory = async (
  category_id = "",
  status = true,
  categoryIds = []
) => {
  try {
    const qwery = status
      ? { status: true, parent_id: category_id }
      : { parent_id: category_id };
    const doc = await Category.find(qwery, { _id: 1 });
    if (doc.length) {
      for (const item of doc) {
        categoryIds.push(item._id);
        categoryIds = await getChildrenCategory(item._id, status, categoryIds);
      }
    }
    return categoryIds;
  } catch (e) {
    throw new DbError("Ошибка обаботки дочерних категорий");
  }
};

const getProductsForCategory = async (alias, sortValue) => {
  try {
    const doc = await Category.findOne(
      { alias },
      {
        parent_id: 1,
      }
    );
    if (!doc) {
      throw new NotFoundError("Категория не существует");
    }
    let categoryIds = [];
    let all = true;

    if (String(doc._id) !== String(doc.parent_id)) {
      all = false;
      categoryIds = await getChildrenCategory(doc._id, true, [doc._id]);
    }

    const qwery = getQweryProducts(categoryIds, all, true);
    const sort = await getSortObj(sortValue);
    const productsList = await Product.find(qwery, {
      _id: 0,
      alias: 1,
      title: 1,
      price: 1,
      filter: 1,
      level1_data: 1,
      update_at: 1,
    }).sort(sort.sortObj);

    const rezult = {
      productsList,
      alias,
      sortValue,
    };

    return rezult;
  } catch (e) {
    globalErrorCheck(e);
  }
};

const arrayToObject = (array = []) => {
  const obj = {};
  array.forEach((element) => {
    if (!obj[element]) {
      obj[element] = element;
    }
  });
  return obj;
};

const getCategoryProductsData = async (categoryIds = [], all = true) => {
  try {
    const $match = {
      status: true,
      "level1_data.level2.amount": { $gt: 0 },
      "level1_data.level1_status": true,
    };

    if (!all) {
      $match.category_ids = { $in: categoryIds };
    }

    const aggregate = await Product.aggregate([
      { $match },
      {
        $project: {
          price: 1,
          filter: 1,
          level1_data: 1,
        },
      },
      {
        $addFields: {
          values: {
            $reduce: {
              input: "$filter",
              initialValue: "",
              in: {
                $cond: {
                  if: { $eq: [{ $indexOfArray: ["$filter", "$$this"] }, 0] },
                  then: { $concat: ["$$value", "$$this"] },
                  else: { $concat: ["$$value", "_", "$$this"] },
                },
              },
            },
          },
        },
      },
      { $unwind: "$level1_data" },
      {
        $project: {
          _id: "$_id",
          price: "$price",
          values: "$values",
          level1_alias: "$level1_data.level1_alias",
          level1_id: "$level1_data._id",
          level2: "$level1_data.level2",
          level1_status: "$level1_data.level1_status",
        },
      },
      {
        $match: {
          level1_status: true,
        },
      },
      { $unwind: "$level2" },
      {
        $project: {
          _id: "$_id",
          price: "$price",
          values: "$values",
          level1_id: "$level1_id",
          level1_alias: "$level1_alias",
          level2_alias: "$level2.level2_alias",
          amount: "$level2.amount",
        },
      },
      {
        $match: {
          amount: { $gt: 0 },
        },
      },
      {
        $group: {
          _id: null,
          minPrice: { $min: "$price" },
          maxPrice: { $max: "$price" },
          productsIds: { $addToSet: "$_id" },
          modifIds: { $addToSet: "$level1_id" },
          level1Alias: { $addToSet: "$level1_alias" },
          level2Alias: { $addToSet: "$level2_alias" },
          values: { $addToSet: "$values" },
        },
      },
    ]);

    const rezult = {
      colors: {},
      level2: {},
      filter: {},
      minPrice: 0,
      maxPrice: 0,
      countModif: 0,
      countProduct: 0,
    };
    if (aggregate) {
      rezult.minPrice = aggregate[0].minPrice;
      rezult.maxPrice = aggregate[0].maxPrice;
      rezult.countModif = aggregate[0].modifIds.length;
      rezult.countProduct = aggregate[0].productsIds.length;
      rezult.colors = arrayToObject(aggregate[0].level1Alias);
      rezult.level2 = arrayToObject(aggregate[0].level2Alias);

      const filterArr = aggregate[0].values.reduce(
        (accumulator, currentValue) => {
          const arr = currentValue.split("_");
          return [...accumulator, ...arr];
        },
        []
      );
      rezult.filter = arrayToObject(filterArr);
    }

    return rezult;
  } catch (e) {
    globalErrorCheck(e);
  }
};

const getCategoryData = async (alias) => {
  try {
    const doc = await Category.findOne(
      { alias },
      {
        parent_id: 1,
        title: 1,
        meta: 1,
        htitle: 1,
        promo: 1,
        content: 1,
        alias: 1,
      }
    );
    if (!doc) {
      throw new NotFoundError("Категория не существует");
    }

    let categoryIds = [];
    let all = true;

    if (String(doc._id) !== String(doc.parent_id)) {
      all = false;
      categoryIds = await getChildrenCategory(doc._id, true, [doc._id]);
    }

    const productsCategoryData = await getCategoryProductsData(
      categoryIds,
      all
    );

    let contData = {};
    contData["meta_title"] = doc.meta.title;
    contData["meta_description"] = doc.meta.description;
    contData["meta_keywords"] = doc.meta.keywords;
    contData["title"] = doc.title;
    contData["htitle"] = doc.htitle;
    contData["promo"] = doc.promo;
    contData["content"] = doc.content;
    let patternData = {};
    patternData["price_pricefr"] = "от " + productsCategoryData.minPrice;
    patternData["price_priceto"] = "до " + productsCategoryData.maxPrice;
    patternData["count_modif"] = productsCategoryData.countModif;
    patternData["count_product"] = productsCategoryData.countProduct;

    contData = await applyPattern(contData, patternData);

    let breadcrumbs = await getParrentCategory(doc._id);
    if (breadcrumbs.length > 0) {
      breadcrumbs[0].disabled = true;
      breadcrumbs = breadcrumbs.reverse();
      const iterator = breadcrumbs.keys();
      for (let key of iterator) {
        breadcrumbs[key]["level"] = key + 2;
      }
    }
    contData["breadcrumbs"] = breadcrumbs;

    const rezult = {
      contCategoryData: contData,
      productsCategoryData,
      alias,
    };

    return rezult;
  } catch (e) {
    console.error(e);
    globalErrorCheck(e);
  }
};

module.exports = {
  getCategoryData,
  getProductsForCategory,
  getCategoryProductsData,
};
