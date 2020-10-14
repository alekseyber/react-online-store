const Category = require("../models/category.model");
const Product = require("../models/product.model");
const Sort = require("../models/sort.model");
const Cache = require("../models/cache.model");
const applyPattern = require("../middleware/apply-pattern");
const getParrentCategory = require("../middleware/get-parrent-category");
const md5 = require("js-md5");
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

const getQweryProducts = (category_ids = [], all, status = true) => {
  if (!status) {
    return all
      ? {}
      : {
          category_ids: { $in: category_ids },
        };
  } else {
    return all
      ? {
          status: true,
          "level1_data.level2.amount": { $gt: 0 },
          "level1_data.level1_status": true,
        }
      : {
          category_ids: { $in: category_ids },
          status: true,
          "level1_data.level2.amount": { $gt: 0 },
          "level1_data.level1_status": true,
        };
  }
};

const getProductsCategory = async (
  alias,
  categoryIds = [],
  all,
  sortValueInput,
  status = true
) => {
  try {
    const qwery = getQweryProducts(categoryIds, all, status);
    const sort = await getSortObj(sortValueInput);
    const sortValue = sort.sortValue;
    const docs = await Product.find(qwery, {
      _id: 1,
      alias: 1,
      title: 1,
      price: 1,
      filter: 1,
      level1_data: 1,
      update_at: 1,
    }).sort(sort.sortObj);
    const rezult = {
      alias,
      sortValue,
      productsList: docs,
    };

    return rezult;
  } catch (e) {
    globalErrorCheck(e);
  }
};

const getProductsByCategory = async (
  aliasCategory,
  categoryIds = [],
  all = true,
  sortValueInput,
  status = true
) => {
  try {
    const products = [];
    const productsFetch = [];
    let colors = {};
    let level2 = {};
    let filter = {};
    let minPrice = 100000000;
    let maxPrice = 0;
    let countProduct = 0;
    let countModif = 0;

    const productsCategory = await getProductsCategory(
      aliasCategory,
      categoryIds,
      all,
      sortValueInput,
      status
    );

    productsCategory.productsList.forEach((item) => {
      const level1Filter = item.level1Filter;
      const filterFilter = item.filterFilter;
      if (level1Filter) {
        const el = {
          alias: item.alias,
          _id: item._id,
          title: item.title,
          update_at: item.update_at_filter,
          price: item.price,
          filterFilter, // filter
          level1Filter: {
            level1: level1Filter.level1,
            level2: level1Filter.level2,
          },
          // level1: level1Filter.level1,
          // level2: level1Filter.level2,
        };

        products.push(el);
        productsFetch.push(el.alias);
        countProduct++;
        countModif += Object.keys(level1Filter.level1).length;
        Object.assign(colors, level1Filter.colors);
        Object.assign(level2, level1Filter.level2);
        Object.assign(filter, filterFilter);
        if (minPrice > item.price) {
          minPrice = item.price;
        }
        if (maxPrice < item.price) {
          maxPrice = item.price;
        }
      }
    });

    productsCategory.productsList = products;
    const sortValue = productsCategory.sortValue;

    const rezult = {
      productsCategory,
      productsData: {
        colors,
        level2,
        filter,
        sortValue,
        minPrice,
        maxPrice,
        countModif,
        countProduct,
        productsFetch,
      },
    };

    return rezult;
  } catch (e) {
    globalErrorCheck(e);
  }
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

const getProductsForCategoryOnlyPorducts = async (alias, sortValue) => {
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

    return await getProductsCategory(
      aliasCategory,
      categoryIds,
      all,
      sortValue
    );
  } catch (e) {
    globalErrorCheck(e);
  }
};

const getProductsForCategoryData = async (alias, sortValue) => {
  try {
    const cacheKey = md5("category_" + alias + sortValue);
    const cacheAction = "category";
    const cacheDataRezult = await Cache.findOne(
      { cacheKey },
      { _id: 0, cacheData: 1 }
    );

    if (cacheDataRezult) {
      return cacheDataRezult.cacheData.get("obj");
    }

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

    const { productsData, productsCategory } = await getProductsByCategory(
      alias,
      categoryIds,
      all,
      sortValue
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
    patternData["price_pricefr"] = "от " + productsData.minPrice;
    patternData["price_priceto"] = "до " + productsData.maxPrice;
    patternData["count_modif"] = productsData.countModif;
    patternData["count_product"] = productsData.countProduct;

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
    const cacheData = {
      obj: { productsData, productsCategory, contData, alias, sortValue },
    };

    const сache = new Cache({ cacheKey, cacheData, cacheAction });
    сache.save();
    return cacheData.obj;
  } catch (e) {
    console.error(e);
    globalErrorCheck(e);
  }
};

module.exports = {
  getProductsForCategoryData,
  getProductsForCategoryOnlyPorducts,
};
