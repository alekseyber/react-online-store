const Bparams = require("../models/bparams.model");
const { NotFoundError, globalErrorCheck } = require("./errors.class");

module.exports.getTextReturnProductData = async () => {
  try {
    const doc = await Bparams.findOne(
      { select: true },
      { _id: 0, textReturnProduct: 1 }
    );
    if (doc) {
      return doc.textReturnProduct;
    }
    throw new NotFoundError();
  } catch (e) {
    globalErrorCheck(e);
  }
};
