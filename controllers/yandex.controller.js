const Bparams = require("../models/bparams.model");
const Yandexorders = require("../models/yandexorders.model");
const { sentOrderData } = require("../controllers_data/order.controller_data");
const {
  getProductByLevelTooData,
} = require("../controllers_data/products.controller_data");
const {
  getErrorStatus,
  YandexTokenError,
} = require("../controllers_data/errors.class");

const yandexTokenValidate = async (tokenCandidat) => {
  const bparams = await Bparams.findOne(
    { select: true },
    { _id: 0, yandexTurboApiToken: 1 }
  );
  if (tokenCandidat !== bparams.yandexTurboApiToken) {
    throw new YandexTokenError(`Authorization: ${tokenCandidat} not found.`);
  }
  return true;
};

const getYandexOrder = async (yandexId) => {
  const yandexOrderDoc = await Yandexorders.findOne(
    { yandexId },
    { accepted: 1, orderId: 1 }
  );
  if (!yandexOrderDoc) {
    const yandexOrderNew = new Yandexorders({ yandexId });
    const yandexOrderDocNew = await yandexOrderNew.save();
    return {
      order: { accepted: true, id: yandexOrderDocNew._id },
      yandexOrderDoc: yandexOrderDocNew,
      isAccepted: false,
    };
  }

  const order = {
    accepted: yandexOrderDoc.accepted,
    id: yandexOrderDoc._id,
  };

  if (!yandexOrderDoc.accepted) {
    order.reason = "OUT_OF_DATE";
  }
  return { order, yandexOrderDoc, isAccepted: true };
};

const getProductItem = async (id) => {
  try {
    return await getProductByLevelTooData(id);
  } catch (e) {
    return false;
  }
};

const yandexOrderGetCart = async (orderCandidat) => {
  const cart = [];
  if (!orderCandidat.items.length) {
    return cart;
  }

  for (const itemCandidat of orderCandidat.items) {
    const item = await getProductItem(itemCandidat.offerId);
    if (item) {
      item.qty = itemCandidat.count;
      item.warning = "";
      if (item.price != itemCandidat.price) {
        item.warning = `Цена в заказе = ${itemCandidat.price}`;
      }
      cart.push(item);
    }
  }
  return cart;
};

class OrderData {
  constructor(orderCandidat, cart) {
    const name = orderCandidat.buyer
      ? orderCandidat.buyer.name
      : "Яндекс Турбо";
    const phone = orderCandidat.buyer
      ? orderCandidat.buyer.phone
      : "79990000000";
    const email = orderCandidat.buyer ? orderCandidat.buyer.email : "";
    const delivery = orderCandidat.delivery ? orderCandidat.buyer.price : "";

    this.name = String(name);
    this.phone = String(phone);
    this.street = "";
    this.house = "";
    this.flat = "";
    this.comment = `ЯТурбо | paymentT: ${String(
      orderCandidat.paymentType
    )} | paymentM: ${String(orderCandidat.paymentMethod)} | Дост.: ${String(
      delivery
    )} | dev: ${String(orderCandidat.paymentMethod)} | email: ${String(
      email
    )} | ${String(orderCandidat.notes)}`;
    this.discontcupon = 1;
    this.cupon = "";
    this.pvzSelectStatus = false;
    this.deliverySelect = 0;
    this.pvzSelect = null;
    this.deliveryPrice = null;
    this.cityObj = { id: 44, cityName: "Москва", oblName: "Москва" };
    this.cart = cart;
  }
}

const setOrderAcceptedOff = async (order, yandexOrderDoc) => {
  order.accepted = false;
  order.reason = "OUT_OF_DATE";
  yandexOrderDoc.accepted = false;
  await yandexOrderDoc.save();
  return order;
};

module.exports.yandexTurboOrderAccept = async (req, res) => {
  try {
    await yandexTokenValidate(req.header("Authorization"));

    const orderCandidat = req.body.order;
    const { order, yandexOrderDoc, isAccepted } = await getYandexOrder(
      orderCandidat.id
    );

    if (isAccepted) {
      return res.status(200).json({ order });
    }

    const cart = await yandexOrderGetCart(orderCandidat);
    if (!cart.length) {
      const orderNoAccepted = await setOrderAcceptedOff(order, yandexOrderDoc);
      return res.status(200).json({ order: orderNoAccepted });
    }

    res.status(200).json({ order });
  } catch (e) {
    getErrorStatus(e, res);
  }
};

module.exports.yandexTurboOrderStatus = async (req, res) => {
  try {
    await yandexTokenValidate(req.header("Authorization"));
    const orderCandidat = req.body.order;

    const { order, yandexOrderDoc, isAccepted } = await getYandexOrder(
      orderCandidat.id
    );

    if ((isAccepted && !order.accepted) || yandexOrderDoc.orderId) {
      return res.status(200).json({ order });
    }

    const cart = await yandexOrderGetCart(orderCandidat);
    if (!cart.length) {
      const orderNoAccepted = await setOrderAcceptedOff(order, yandexOrderDoc);
      return res.status(200).json({ order: orderNoAccepted });
    }

    const orderInputData = new OrderData(orderCandidat, cart);
    const orderRezult = await sentOrderData(orderInputData, req.ip);
    yandexOrderDoc.orderId = orderRezult.order.orderId;
    if (orderRezult.success) {
      await yandexOrderDoc.save();
    }
    res.status(200).json({ order });
  } catch (e) {
    // console.log(e.message);
    getErrorStatus(e, res);
  }
};
