const geoip = require("geoip-lite");
const { addGet } = require("../middleware/urlscreater");
const verifyingGRecaptcha = require("../middleware/verifying-g-recaptcha");
const {
  sendAdminEmailFromOrder,
  sendAdminEmailReturnProduct,
  sendAdminEmailReturnCall,
} = require("../emails/sendmail");
const Acquirer = require("../models/acquirer.model");
const Ordernumber = require("../models/ordernumber.model");
const Cupon = require("../models/cupon.model");
const Product = require("../models/product.model");
const Order = require("../models/order.model");
const Returnproduct = require("../models/returnproduct.model");
const Returncall = require("../models/returncall.model");
const formatDateStr = require("../middleware/format-date-str");
const Params = require("../models/params.model");
const { getColors, getSizes } = require("../middleware/start-data");
const {
  OrderError,
  NotFoundError,
  RecaptchaError,
  DetectPfoneError,
  globalErrorCheck,
  SuccessClass,
} = require("./errors.class");

const phoneFormat = (inputPhone) => {
  const rezult = inputPhone.replace(/[^0-9]/gim, "");
  return rezult.replace(/^8/, "7");
};

const detectAcquirer = async (phone, status_block = false) => {
  let rezult = false;
  try {
    const acquirer = await Acquirer.findOne(
      { phone, status_block },
      { phone: 1 }
    );
    if (acquirer) {
      rezult = acquirer._id;
    }
  } catch (e) {
  } finally {
    return rezult;
  }
};

const detectReturnProduct = async (acquirer_id) => {
  try {
    const doc = await Returnproduct.findOne(
      { acquirer_id },
      { _id: 0, status: 1 }
    );
    if (doc) {
      return false;
    }
  } catch (e) {
  } finally {
    return true;
  }
};

const getOrderNum = async () => {
  try {
    return await Ordernumber.getNumber();
  } catch (e) {
    console.error(e);
    return "00-100";
  }
};

const productValidate = async (alias, level1_alias, level2_alias) => {
  try {
    const aggregate = await Product.aggregate([
      {
        //  $match: { _id: product_id }
        $match: { alias },
      },

      {
        $project: {
          // "_id": 0,
          level1_data: 1,
          title: 1,
          product_model: 1,
        },
      },
      { $unwind: "$level1_data" },
      { $match: { "level1_data.level1_alias": level1_alias } },
      {
        $project: {
          product_id: "$_id",
          product_model: "$product_model",
          title: "$title",
          level1_id: "$level1_data._id",
          level2: "$level1_data.level2",
          gallery: "$level1_data.gallery",
        },
      },

      { $unwind: "$gallery" },
      { $match: { "gallery.main": true } },
      {
        $project: {
          product_id: "$product_id",
          product_model: "$product_model",
          title: "$title",
          level1_id: "$level1_id",
          level2: "$level2",
          img: "$gallery.img",
        },
      },

      { $unwind: "$level2" },
      { $match: { "level2.level2_alias": level2_alias } },
      {
        $project: {
          product_id: "$product_id",
          product_model: "$product_model",
          title: "$title",
          level1_id: "$level1_id",
          img: "$img",
          level2_id: "$level2._id",
        },
      },
    ]);
    if (aggregate) {
      const product_id = aggregate[0].product_id;
      const level1_id = aggregate[0].level1_id;
      const level2_id = aggregate[0].level2_id;
      const img = aggregate[0].img;
      const title = aggregate[0].title;
      const product_model = aggregate[0].product_model;

      return { product_id, level1_id, level2_id, img, title, product_model };
    } else {
      return false;
    }
  } catch (e) {
    console.error(e.message);
    return false;
  }
};

const getCartValidate = async (cart, discontcupon) => {
  try {
    let summa = 0;
    const cartData = [];

    const docParams = await Params.findOne(
      { select: true },
      { _id: 0, productImgProperty: 1 }
    );
    const imgPath = docParams.productImgProperty.filter(
      (el) => el.status === "thumb"
    )[0].path;

    const { colors } = await getColors();
    const sizesData = await getSizes();

    for (const itemCart of cart) {
      const item = {};
      item.title = "";
      item.img = "";
      item.link = `/product/${itemCart.alias}`;

      item.price = Math.round(Number(itemCart.price) * discontcupon);
      item.basePrice = itemCart.price;
      item.qty = Number(itemCart.qty);
      item.itemSumm = item.price * item.qty;
      summa += item.itemSumm;
      item.warning = "";
      if (itemCart.warning !== "false" && itemCart.warning) {
        item.warning = itemCart.warning.trim();
      }

      item.level1_alias = "";
      item.level2_alias = "";

      if (itemCart.selectparams) {
        item.level1_alias = itemCart.selectparams.color;
        item.level2_alias = itemCart.selectparams.sizes;
      } else {
        if (itemCart.level1) {
          item.level1_alias = itemCart.level1;
        }
        if (itemCart.level2) {
          item.level2_alias = itemCart.level2;
        }
      }

      item.level1_id = "";
      item.level2_id = "";
      item.product_id = "";

      item.valid = false;
      const validItem = await productValidate(
        itemCart.alias,
        item.level1_alias,
        item.level2_alias
      );
      if (validItem) {
        item.level1_id = String(validItem.level1_id);
        item.level2_id = String(validItem.level2_id);
        item.valid = true;
        item.product_id = validItem.product_id;
        item.title = validItem.title;
        item.img = imgPath + validItem.img;

        if (validItem.product_model < 3 && colors[item.level1_alias]) {
          item.link = addGet(item.link, "colors", item.level1_alias);
          item.title = item.title + " " + colors[item.level1_alias].title;
        }

        if (
          (validItem.product_model === 1 || validItem.product_model === 4) &&
          sizesData[item.level2_alias]
        ) {
          item.title = item.title + " р." + sizesData[item.level2_alias].title;
        }
      }
      cartData.push(item);
    }

    return { cartData, summa };
  } catch (e) {
    throw new OrderError(e.message);
  }
};

const cuponValidate = async (cupon_id) => {
  let rezult = {
    status: false,
    discont: 1,
    cupon_id: "",
  };

  try {
    const startDate = new Date();
    startDate.setHours(0);
    startDate.setMinutes(0);
    startDate.setSeconds(0);
    const doc = await Cupon.findOne({
      _id: cupon_id,
      status: true,
      expiryDate: { $gte: startDate },
    });

    if (doc !== null) {
      rezult.discont = parseFloat(doc.discontvalue.toString());
    }
    if (!Number.isNaN(rezult.discont)) {
      rezult.status = true;
      rezult.cupon_id = doc._id;
    }
  } catch (e) {
    console.error(e.message);
  } finally {
    return rezult;
  }
};

// function detectIP(req) {
//   //=====================================
//   const ip =
//     (req.headers["x-forwarded-for"] || "").split(",").pop() ||
//     req.connection.remoteAddress ||
//     req.socket.remoteAddress ||
//     req.connection.socket.remoteAddress;
//   //======================================
//   return ip;
// }

module.exports.sentOrderData = async (inputData, ip) => {
  try {
    let validInput = false;

    if ("phone" in inputData && "cart" in inputData && "cityObj" in inputData) {
      if (Array.isArray(inputData.cart)) {
        validInput = true;
      }
    }

    if (!validInput) {
      throw new OrderError("Ошибка передачи данных");
    }

    //const ip = "46.188.24.198";
    const geo = geoip.lookup(ip);
    const phone = phoneFormat(inputData.phone);
    const dateStr = formatDateStr();

    const acquirer_block = await detectAcquirer(phone, true);
    const orderNum = await getOrderNum();

    let order = {};
    order.orderNum = orderNum;
    order.acquirer_block = false;
    if (acquirer_block) {
      order.acquirer_block = true;
    }

    order.name = inputData.name.trim();
    order.phone = phone;
    order.cityName = inputData.cityObj.cityName;
    order.cityId = Number(inputData.cityObj.id);
    order.oblName = inputData.cityObj.oblName;
    order.cityId = inputData.cityObj.id;
    order.acquirer_ip = ip;
    order.street = inputData.street.trim();
    order.house = inputData.house.trim();
    order.flat = inputData.flat.trim();
    order.comment = inputData.comment.trim();
    if (geo !== null) {
      order.geoCity = geo.city;
    }
    order.cupon = false;
    order.cupon_id = "";
    order.discontcupon = 1;

    if (inputData.cupon !== "false" && inputData.cupon) {
      const cuponData = await cuponValidate(inputData.cupon.trim());
      if (cuponData.status) {
        order.cupon = true;
        order.cupon_id = String(cuponData.cupon_id);
        order.discontcupon = cuponData.discont;
      }
    }

    order.deliveryComment = `${order.cityName} (${order.cityId}) ${dateStr}: `;
    order.deliveryPrice = 0;
    order.deliveryPriceCourier = 0;
    order.deliveryPricePvz = 0;
    order.deliverySelect = 0;
    if (inputData.deliverySelect === 1) {
      order.deliverySelect = 1;
    }
    if (inputData.deliveryPrice !== "false" && inputData.deliveryPrice) {
      order.deliveryPriceCourier = Number(
        inputData.deliveryPrice.courier.priceByCurrency
      );
      order.deliveryPricePvz = Number(
        inputData.deliveryPrice.pvz.priceByCurrency
      );
      order.deliveryComment += `срок: ${inputData.deliveryPrice.courier.deliveryPeriodMax}, дата: ${inputData.deliveryPrice.courier.deliveryDateMax}.`;
    }
    order.deliveryPrice = order.deliveryPriceCourier;
    order.pvzCode = "";
    order.pvzSelect = false;

    if (
      inputData.pvzSelect &&
      inputData.pvzSelectStatus &&
      inputData.pvzSelect !== "false" &&
      inputData.pvzSelectStatus !== "false"
    ) {
      order.pvzCode = inputData.pvzSelect.Code;
      order.pvzSelect = true;
      order.deliveryComment += ` Адрес ПВЗ: ${inputData.pvzSelect.Address}, время: ${inputData.pvzSelect.WorkTime}.`;
      order.deliveryPrice = order.deliveryPricePvz;
    }

    const cart = await getCartValidate(inputData.cart, order.discontcupon);
    order.cart = cart.cartData;
    order.summa = cart.summa;
    order.discontcupon = String(order.discontcupon);

    const newOrder = new Order(order);
    const doc = await newOrder.save();
    order.orderId = doc._id;
    order.dateStr = dateStr;

    sendAdminEmailFromOrder(order);

    const rezultOrder = new SuccessClass(`Заказ № ${orderNum} получен.`);
    rezultOrder.order = {
      orderNum,
      orderId: doc._id,
    };

    // const rezultOrder = {
    //   order: orderNum,
    //   orderId: doc._id,
    // };
    return rezultOrder;
  } catch (e) {
    console.error(e.message);
    globalErrorCheck(e);
  }
};

module.exports.getCuponData = async (cupontextInput) => {
  try {
    const cupontext = String(cupontextInput);
    let rezultStatus = false;
    let rezult = {};
    if (cupontext.length > 5 && cupontext.length < 12) {
      const startDate = new Date();
      startDate.setHours(0);
      startDate.setMinutes(0);
      startDate.setSeconds(0);
      const doc = await Cupon.findOne({
        cupontext: cupontext,
        status: true,
        expiryDate: { $gte: startDate },
      });

      if (doc !== null) {
        rezult = {
          value: parseFloat(doc.discontvalue.toString()),
          cuponId: doc._id,
        };
        if (!Number.isNaN(rezult.value)) {
          rezultStatus = true;
        }
      }
    }
    if (rezultStatus) {
      return rezult;
    }

    throw new NotFoundError("Купон не найден");
  } catch (e) {
    globalErrorCheck(e);
  }
};

module.exports.fetchOrderByIdData = async (id) => {
  try {
    const doc = await Order.findById(id);
    if (!doc) {
      throw new NotFoundError("Заказ не найден");
    }

    await doc
      .populate("orderStatus_id", "title")
      .populate("acquirer_id", "status_block")
      .execPopulate();

    if (doc.acquirer_id.status_block === false && doc.hiddenClient === false) {
      const rezult = {};
      rezult.id = doc._id;
      rezult.orderNum = doc.orderNum;
      rezult.cityName = doc.cityName;
      rezult.payAwait = doc.payAwait;
      rezult.payStatus = doc.payStatus;
      rezult.orderStatus = doc.orderStatus_id.title;
      rezult.phone = "+7(xxx) xxxx" + doc.phone.substr(doc.phone.length - 3);
      rezult.orderData = formatDateStr(doc.created_at, false);
      rezult.summa = doc.summa;
      rezult.cart = doc.cart;
      return rezult;
    }
    throw new NotFoundError("Заказ не найден");
  } catch (e) {
    throw new NotFoundError("Заказ не найден");
    //  globalErrorCheck(e);
  }
};

module.exports.returnProductFormData = async (inputData, acquirer_ip) => {
  try {
    const recaptchaStatus = await verifyingGRecaptcha(
      inputData.recaptchaToken,
      acquirer_ip
    );
    if (!recaptchaStatus) {
      throw new RecaptchaError();
    }

    const phone = phoneFormat(inputData.phone);
    const acquirer_id = await detectAcquirer(phone);

    if (acquirer_id) {
      const detect = await detectReturnProduct(acquirer_id);

      if (detect) {
        const action = Number(inputData.action);

        const rezultObj = { acquirer_id, phone, action, acquirer_ip };
        const newReturnProduct = new Returnproduct(rezultObj);
        await newReturnProduct.save();
        rezultObj.dateStr = formatDateStr();

        rezultObj.actionStr = action === 0 ? "обмен" : "возврат";
        sendAdminEmailReturnProduct(rezultObj);
        // return doc;
      }
    }
    return new SuccessClass("Заявка получена");
    //throw new DetectPfoneError("returnProductFormData not Detect");
  } catch (e) {
    globalErrorCheck(e);
  }
};

module.exports.returnCallFormData = async (inputData, user_ip) => {
  try {
    const recaptchaStatus = await verifyingGRecaptcha(
      inputData.recaptchaToken,
      user_ip
    );
    if (!recaptchaStatus) {
      throw new RecaptchaError();
    }

    const phone = phoneFormat(inputData.phone);
    const name = String(inputData.name.trim());
    const comment = String(inputData.comment.trim());
    if (phone) {
      const rezultObj = { phone, name, comment, user_ip };
      const newReturnCall = new Returncall(rezultObj);
      await newReturnCall.save();
      rezultObj.dateStr = formatDateStr();
      sendAdminEmailReturnCall(rezultObj);
      return new SuccessClass("Заявка получена");
    }
    throw new DetectPfoneError("returnCallFormData not phone detect");
  } catch (e) {
    globalErrorCheck(e);
  }
};
