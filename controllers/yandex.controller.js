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
  const yandexOrder = await Yandexorders.findOne(
    { yandexId },
    { _id: 0, accepted: 1, id: 1 }
  );
  if (!yandexOrder) {
    return false;
  }

  const order = {
    accepted: yandexOrder.accepted,
    id: yandexOrder.id,
  };

  if (!yandexOrder.accepted) {
    rezult.order.reason = "OUT_OF_DATE";
  }
  return { order };
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
    this.name = "Яндекс Турбо";
    this.phone = "79990000000";
    this.street = "";
    this.house = "";
    this.flat = "";
    this.comment = `ЯТурбо | paymentType: ${orderCandidat.paymentType} | paymentMethod: ${orderCandidat.paymentMethod} | Доставка: ${orderCandidat.delivery.price} | dev: ${orderCandidat.paymentMethod} | ${orderCandidat.notes}`;
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

module.exports.yandexTurboOrder = async (req, res) => {
  try {
    const orderRezultNoAccepted = {
      order: {
        accepted: false,
        reason: "OUT_OF_DATE",
      },
    };
    await yandexTokenValidate(req.header("Authorization"));
    const orderCandidat = req.body.order;
    const orderBeenAccepted = await getYandexOrder(orderCandidat.id);
    if (orderBeenAccepted) {
      return res.status(200).json(orderBeenAccepted);
    }
    const cart = await yandexOrderGetCart(orderCandidat);
    if (!cart.length) {
      return res.status(200).json(orderRezultNoAccepted);
    }

    const orderInputData = new OrderData(orderCandidat, cart);

    const orderRezult = await sentOrderData(orderInputData, req.ip);

    if (!orderRezult.success) {
      return res.status(200).json(orderRezultNoAccepted);
    }

    const id = orderRezult.order.orderId;
    const yandexNewOrder = new Yandexorders({
      yandexId: orderCandidat.id,
      id,
    });
    await yandexNewOrder.save();

    const order = {
      accepted: true,
      id,
    };

    res.status(200).json({ order });
  } catch (e) {
   // console.log(e.message);
    getErrorStatus(e, res);
  }
};
