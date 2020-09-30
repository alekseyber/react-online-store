const { model, Schema } = require("mongoose");

const cacheSchema = new Schema({
  cacheKey: {
    type: String,
    required: true,
    index: true,
    unique: true,
  },
  cacheData: {
    type: Map,
    required: true,
  },
  cacheAction: {
    type: String,
    default: "",
  },
  createdAt: {
    type: Date,
    expires: "60m",
    default: Date.now,
  },
});

cacheSchema.pre("save", async function (next) {
  try {
    const cacheKey = this.cacheKey;
    const doc = await this.constructor.findOne({ cacheKey }, { _id: 1 });
    if (doc) {
      await this.constructor.deleteOne({ cacheKey });
    }

    next();
  } catch (e) {
    //console.error(e);
  }
});

module.exports = model("cache", cacheSchema);
