const { model, Schema } = require("mongoose");
const brand = require("../models/brand.model");
const bagde = require("../models/bagde.model");
const sizesgroup = require("../models/sizesgroup.model");
const category = require("../models/category.model");
const packages = require("../models/packages.model");
const createAlias = require("../middleware/create-alias");

const productSchema = new Schema(
  {
    alias: {
      type: String,
      index: true,
      unique: [true, "Alias должен быть уникальным"],
      default: "",
    },
    title: {
      type: String,
      required: [true, "Title должен быть заполненным"],
    },
    // seolink: {
    //     type: String,
    //     default: ""
    // },
    sku: {
      type: String,
      default: "",
    },
    price: {
      type: Number,
      index: true,
      required: true,
    },
    old_price: {
      type: Number,
      default: 0,
    },
    color_default: {
      type: String,
      default: "",
    },
    category_id: {
      type: Schema.ObjectId,
      ref: category,
      required: true,
    },
    category_ids: [
      {
        type: Schema.ObjectId,
        ref: category,
        required: true,
      },
    ],
    sizesgroup_id: {
      type: Schema.ObjectId,
      ref: sizesgroup,
      required: true,
    },
    // related: {
    //     type: String,
    //     default: ""
    // },
    related_id: {
      type: Schema.ObjectId,
      ref: "product",
    },
    brand_id: {
      type: Schema.ObjectId,
      ref: brand,
      required: true,
    },
    gender: {
      type: String,
      enum: [
        "Женские",
        "Мужские",
        "Детские",
        "Унисекс",
        "Аксессуары",
        "Other",
        "",
      ],
      required: true,
    },
    product_model: {
      type: Number,
      enum: [1, 2, 3, 4],
      required: true,
      default: 1,
    },
    content: {
      type: String,
      default: "",
    },
    status: {
      type: Boolean,
      default: true,
    },
    hit: {
      type: Boolean,
      default: false,
    },
    cart_on: {
      type: Boolean,
      default: false,
    },
    packages_id: {
      type: Schema.ObjectId,
      ref: packages,
    },
    meta: {
      title: {
        type: String,
        default: "",
      },
      description: {
        type: String,
        default: "",
      },
      keywords: {
        type: String,
        default: "",
      },
    },
    filter: {
      type: [String],
      default: [],
    },
    level1_data: [
      {
        level1_alias: {
          type: String,
          required: true,
          index: true,
        },
        level1_status: {
          type: Boolean,
          default: true,
        },
        price: {
          type: Number,
          default: 0,
          min: 0,
        },
        old_price: {
          type: Number,
          default: 0,
          min: 0,
        },
        bagde_id: {
          type: Schema.ObjectId,
          ref: bagde,
        },
        gallery: [
          {
            img: {
              type: String,
              required: true,
            },
            main: {
              type: Boolean,
              default: false,
            },
            sortvalue_gallery: {
              type: Number,
              default: 0,
              index: true,
            },
          },
        ],
        level2: [
          {
            level2_alias: {
              type: String,
              required: true,
              index: true,
            },
            amount: {
              type: Number,
              default: 100,
              min: 0,
            },
          },
        ],
      },
    ],
  },
  {
    timestamps: { createdAt: "createdAt" },
    timestamps: { updatedAt: "update_at" },
  }
);

productSchema.index({ update_at: 1, type: -1 });

productSchema.virtual("level1").get((value, virtual, doc) => {
  const rezult = {};
  doc.level1_data.forEach((el) => {
    if (el.level1_status === true) {
      const level2 = [];
      el.level2.forEach((itemlevel2) => {
        if (itemlevel2.amount > 0) {
          level2.push(itemlevel2.level2_alias);
        }
      });
      if (level2.length && el.level1_status) {
        rezult[el.level1_alias] = {
          price: el.price,
          old_price: el.old_price,
          bagde_id: el.bagde_id,
          img: el.gallery[0].img,
          level2: level2,
        };
      }
    }
  });
  return rezult;
});

productSchema.virtual("level1Arr").get((value, virtual, doc) => {
  const rezult = [];
  doc.level1_data.forEach((el) => {
    if (el.level1_status === true) {
      const level2 = [];
      el.level2.forEach((itemlevel2) => {
        if (itemlevel2.amount > 0) {
          level2.push(itemlevel2.level2_alias);
        }
      });
      if (level2.length && el.level1_status) {
        rezult.push({
          level1_alias: el.level1_alias,
          price: el.price,
          old_price: el.old_price,
          bagde_id: el.bagde_id,
          img: el.gallery[0].img,
          level2: level2,
        });
      }
    }
  });
  return rezult;
});

productSchema.virtual("level1_gal").get((value, virtual, doc) => {
  const rezult = {};
  doc.level1_data.forEach((el) => {
    if (el.level1_status) {
      const imgs = [];
      el.gallery.forEach((item) => {
        imgs.push(item.img);
      });

      rezult[el.level1_alias] = imgs;
    }
  });
  return rezult;
});

productSchema.virtual("level1_gal_arr").get((value, virtual, doc) => {
  const rezult = [];
  doc.level1_data.forEach((el) => {
    if (el.level1_status) {
      const imgs = [];
      el.gallery.forEach((item) => {
        imgs.push(item.img);
      });

      rezult.push({
        level1_alias: el.level1_alias,
        imgs,
      });
    }
  });
  return rezult;
});

productSchema.virtual("level1_filter").get((value, virtual, doc) => {
  const rezult = {
    level1: {},
    colors: {},
    level2: {},
  };
  doc.level1_data.forEach((el) => {
    if (el.level1_status === true) {
      const level2 = {};
      el.level2.forEach((itemlevel2) => {
        if (itemlevel2.amount > 0) {
          level2[itemlevel2.level2_alias] = itemlevel2.level2_alias;

          if (rezult.level2[itemlevel2.level2_alias] === undefined) {
            rezult.level2[itemlevel2.level2_alias] = itemlevel2.level2_alias;
          }
        }
      });

      if (level2.length !== {}) {
        rezult.level1[el.level1_alias] = level2;
        rezult.colors[el.level1_alias] = el.level1_alias;
      }
    }
  });
  if (rezult.level2.length === 0) {
    return null;
  }
  return rezult;
});

productSchema.virtual("filter_filter").get((value, virtual, doc) => {
  const rezult = {};
  doc.filter.forEach((el) => {
    rezult[el] = el;
  });

  return rezult;
});

productSchema.virtual("update_at_filter").get((value, virtual, doc) => {
  return doc.update_at.getTime();
});

productSchema.pre("save", async function (next) {
  try {
    const modelName = "product";

    if (this.alias !== undefined) {
      const _id = this._id !== undefined ? this._id : "";
      const alias = this.alias;
      const title = "title" in this ? this.title : "";

      const path = "alias";
      const addStr = this.gender !== undefined ? this.gender : "";
      const candidate = await createAlias(
        modelName,
        title,
        path,
        alias,
        _id,
        addStr
      );
      if (String(alias) !== String(candidate)) {
        if (candidate) {
          this.alias = candidate;
        } else {
          throw new Error("Ошибка генерации Alias, не сохранено.");
        }
      }
    }
  } catch (e) {
    console.error(e);
    throw new Error(e.message);
  }
  next();
});

module.exports = model("product", productSchema);
