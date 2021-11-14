const { model, Schema } = require("mongoose");

const mainpageSchema = new Schema(
  {
    title: {
      type: String,
      default: "",
    },
    hittitle: {
      type: String,
      default: "",
    },
    hitvisible: {
      type: Boolean,
      default: true,
    },
    hitcount: {
      type: Number,
      default: 8,
    },
    maincatalogvisible: {
      type: Boolean,
      default: true,
    },
    maincatalogcount: {
      type: Number,
      default: 3,
    },
    maincatalogprefix: {
      type: String,
      default: "",
    },
    topslidervisible: {
      type: Boolean,
      default: true,
    },
    topSliderAutoPlay: {
      type: Boolean,
      default: true,
    },
    topSliderInterval: {
      type: Number,
      default: 4000,
    },
    main: {
      type: Boolean,
      default: false,
    },
    promo: {
      type: String,
      default: "",
    },
    content: {
      type: String,
      default: "",
    },
    // update_at: {
    //     type: Date,
    //     default: Date.now
    // },
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
    mainBanner: {
      visible: {
        type: Boolean,
        default: false,
      },
      title: {
        type: String,
        default: "",
      },
      description: {
        type: String,
        default: "",
      },
      btnText: {
        type: String,
        default: "",
      },
      btnLink: {
        type: String,
        default: "",
      },
      imgBacgr: {
        type: String,
        default: "",
      },
    },
  },
  {
    timestamps: { updatedAt: "update_at" },
  }
);

module.exports = model("mainpage", mainpageSchema);
