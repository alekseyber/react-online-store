const { model, Schema } = require("mongoose");

const topsliderSchema = new Schema({
  status: {
    type: Boolean,
    default: false,
  },
  sortvalue: {
    type: Number,
    default: 0,
    index: true,
  },
  mainFontColor: {
    type: String,
    default: "FFFFFF",
  },
  mainBackgroundColor: {
    type: String,
    default: "771818",
  },
  mainTitle: {
    type: String,
    default: "",
  },
  mainDescription: {
    type: String,
    default: "",
  },
  mainLinkHref: {
    type: String,
    default: "",
  },
  mainLinkAncor: {
    type: String,
    default: "",
  },
  secondLinkHref1: {
    type: String,
    default: "",
  },
  secondLinkAncor1: {
    type: String,
    default: "",
  },
  secondLinkHref2: {
    type: String,
    default: "",
  },
  secondLinkAncor2: {
    type: String,
    default: "",
  },
  secondImg1: {
    type: String,
    default: "",
  },
  secondImg2: {
    type: String,
    default: "",
  },
});

module.exports = model("topslider", topsliderSchema);
