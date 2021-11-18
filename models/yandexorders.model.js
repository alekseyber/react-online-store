const { model, Schema } = require("mongoose");
const Order = require("./order.model");

const yandexordersSchema = new Schema(
  {
    yandexId: {
      type: Number,
      required: true,
      index: true,
    },
    accepted: {
      type: Boolean,
      default: true,
    },
    orderId: {
      type: Schema.ObjectId,
      ref: Order,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = model("yandexorders", yandexordersSchema);
