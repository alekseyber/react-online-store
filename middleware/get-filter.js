const Product = require("../models/product.model");
const Filter = require("../models/filter.model");
const Сolor = require("../models/colors.model");
const Sizes = require("../models/sizes.model");
const Cache = require("../models/cache.model");
const md5 = require("js-md5");

const getColorGr = async () => {
  try {
    const aggregate = await Сolor.aggregate([
      {
        $project: {
          _id: 0,
          children: 1,
          alias: 1,
        },
      },
      { $unwind: "$children" },
      {
        $project: {
          alias: "$alias",
          aliasitem: "$children.aliasitem",
        },
      },
      {
        $group: {
          _id: "$alias",
          children: { $addToSet: "$aliasitem" },
        },
      },
      { $addFields: { groupselect: "group" } },
      { $addFields: { newobj: { $arrayToObject: [[["$_id", "$children"]]] } } },
      {
        $group: {
          _id: null,
          group: { $mergeObjects: "$newobj" },
        },
      },
    ]);
    if (aggregate.length) {
      return aggregate[0].group;
    }

    return {};
  } catch (e) {
    throw new Error("Ошибка БД Colors");
  }
};

const getColorChilds = async () => {
  try {
    const aggregate = await Сolor.aggregate([
      {
        $project: {
          _id: 0,
          children: 1,
          alias: 1,
        },
      },
      { $unwind: "$children" },
      {
        $project: {
          alias: "$alias",
          aliasitem: "$children.aliasitem",
        },
      },

      { $addFields: { groupselect: "group" } },
      {
        $addFields: {
          newobj: { $arrayToObject: [[["$aliasitem", "$alias"]]] },
        },
      },
      {
        $group: {
          _id: null,
          group: { $mergeObjects: "$newobj" },
        },
      },
    ]);
    if (aggregate.length) {
      return aggregate[0].group;
    }

    return {};
  } catch (e) {
    throw new Error("Ошибка БД Colors");
  }
};

const getFilter = async () => {
  try {
    const cacheKey = md5("filter_filter");
    const cacheAction = "filter";
    const doc = await Cache.findOne({ cacheKey }, { _id: 0, cacheData: 1 });

    if (doc) {
      return doc.cacheData.get("obj");
    }

    const aggregate = await Product.aggregate([
      { $match: { status: true } },
      {
        $project: {
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
          colors: "$level1_data.level1_alias",
          level2: "$level1_data.level2",
          id: "$_id",
        },
      },
      { $unwind: "$level2" },
      {
        $project: {
          colors: "$colors",
          sizes: "$level2.level2_alias",
          amount: "$level2.amount",
          id: "$id",
        },
      },
      { $match: { amount: { $ne: 0 } } },
      {
        $group: {
          _id: "products",
          colors: { $addToSet: "$colors" },
          sizes: { $addToSet: "$sizes" },
          ids: { $addToSet: "$id" },
        },
      },
    ]);

    const filters_query = Product.distinct(
      "filter",
      { _id: { $in: aggregate[0].ids } },
      function (err, docs) {
        if (!err) {
          return docs;
        } else {
          return null;
        }
      }
    );

    const filters = await filters_query.exec();

    const arrayToObject = (array) =>
      array.reduce((obj, item) => {
        obj[item] = item;
        return obj;
      }, {});

    const getSortedIndexList = (list) =>
      Object.keys(list).sort(
        (a, b) => list[a].sortvalueitem - list[b].sortvalueitem
      );

    let rezult = {
      filter: {},
      colors: [],
      sizes: [],
    };
    if (filters.length > 0) {
      rezult.filter = arrayToObject(filters);
    }

    if (aggregate[0].colors.length > 0) {
      const colors_aggregate = await Сolor.aggregate([
        { $sort: { sortvalue: 1 } },
        {
          $project: {
            _id: 0,
            alias: "$alias",
            alias_item: "$children.aliasitem",
          },
        },
        { $unwind: "$alias_item" },
        { $match: { alias_item: { $in: aggregate[0].colors } } },
        { $group: { _id: "colors", alias: { $addToSet: "$alias" } } },
        { $unwind: "$alias" },
        {
          $project: {
            _id: 0,
            alias: "$alias",
          },
        },
      ]);

      if (colors_aggregate.length > 0) {
        rezult.colors = colors_aggregate;
      }
    }
    if (aggregate[0].sizes.length > 0) {
      const sizes_aggregate = await Sizes.aggregate([
        { $match: { alias: { $in: aggregate[0].sizes } } },
        { $sort: { sortvalue: 1 } },
        {
          $project: {
            _id: 0,
            alias: "$alias",
          },
        },
      ]);
      if (sizes_aggregate.length > 0) {
        rezult.sizes = sizes_aggregate;
      }
    }

    const filterData = await Filter.find(
      { status: true, filter: true },
      { _id: 0, color: 1, sizes: 1, title: 1, alias: 1, attrs: 1 }
    ).sort({ sortvalue: 1 });
    let filterRezult = [];
    let filterIndex = [{}, {}];

    if (filterData) {
      let q = 0;
      filterData.forEach((grupp) => {
        let attrs = [];

        if (grupp.color) {
          if (rezult.colors.length > 0) {
            attrs = rezult.colors;
          }
        } else if (grupp.sizes) {
          if (rezult.sizes.length > 0) {
            attrs = rezult.sizes;
          }
        } else {
          const tempAttrs = grupp.attrs.toObject();
          const keysSorted = getSortedIndexList(tempAttrs);
          keysSorted.forEach((index) => {
            if (
              tempAttrs[index].status_attr &&
              rezult.filter[tempAttrs[index].alias_attrs] !== undefined
            ) {
              filterIndex[1][tempAttrs[index].alias_attrs] = [q, Number(index)];
              const itemforRezult = {
                title: tempAttrs[index].title,
                alias: tempAttrs[index].alias_attrs,
                tags: tempAttrs[index].tags,
              };
              attrs.push(itemforRezult);
            }
          });
        }
        if (attrs.length > 0) {
          filterIndex[0][grupp.alias] = q;
          if (grupp.color || grupp.sizes) {
            for (let i = 0; i < attrs.length; i++) {
              filterIndex[1][attrs[i].alias] = [q, i];
            }
          }
          q++;
          const item = {
            alias: grupp.alias,
            title: grupp.title,
            color: grupp.color,
            sizes: grupp.sizes,
            radio: grupp.radio,
            attrs: attrs,
          };
          filterRezult.push(item);
        }
      });
    }

    const colorsGrupp = await getColorGr();
    const colorsChToGr = await getColorChilds();
    const cacheData = {};
    cacheData.obj = { filterRezult, filterIndex, colorsGrupp, colorsChToGr };
    const сache = new Cache({ cacheKey, cacheData, cacheAction });
    await сache.save();
    return cacheData.obj;
  } catch (e) {
    throw e;
  }
};

module.exports = {
  getFilter,
};
