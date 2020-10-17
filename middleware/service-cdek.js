const Deliverysettings = require("../models/deliverysettings.model");
const Order = require("../models/order.model");
const Product = require("../models/product.model");
const Cacheauth = require("../models/cacheauth.model");
const axios = require("axios");
const oauth = require("axios-oauth-client");

function getDateStr(value) {
  const inputDate = new Date(value);

  const day = ("0" + inputDate.getDate()).slice(-2);
  const year = inputDate.getFullYear();
  const month = ("0" + (inputDate.getMonth() + 1)).slice(-2);
  //const hours = ('0' + inputDate.getHours()).slice(-2);
  //const minutes = ('0' + inputDate.getMinutes()).slice(-2);
  return `${year}-${month}-${day}`;
}

//Дополнительные статусы заказов
const addOrderStatuses = {
  1: {
    name: "Возврат, неверный адрес",
    provided: false,
  },
  2: {
    name: "Возврат, не дозвонились",
    provided: false,
  },
  3: {
    name: "Возврат, адресат не проживает",
    provided: false,
  },
  4: {
    name:
      "Возврат, не должен выполняться: вес отличается от заявленного более, чем на X г.",
    provided: false,
  },
  5: {
    name:
      "Возврат, не должен выполняться: фактически нет отправления (на бумаге есть)",
    provided: false,
  },
  6: {
    name:
      "Возврат, не должен выполняться: дубль номера заказа в одном акте приема-передачи",
    provided: false,
  },
  7: {
    name:
      "Возврат, не должен выполняться: не доставляем в данный город(регион)",
    provided: false,
  },
  8: {
    name: "Возврат, повреждение упаковки, при приемке от отправителя",
    provided: false,
  },
  9: {
    name: "Возврат, повреждение упаковки, у перевозчика",
    provided: false,
  },
  10: {
    name: "Возврат, повреждение упаковки, на нашем складе(доставке) у курьера",
    provided: false,
  },
  11: {
    name: "Возврат, отказ от получения: Без объяснения",
    provided: true,
  },
  12: {
    name: "Возврат, отказ от получения: Претензия к качеству товара",
    provided: true,
  },
  13: {
    name: "Возврат, отказ от получения: Недовложение",
    provided: true,
  },
  14: {
    name: "Возврат, отказ от получения: Пересорт",
    provided: true,
  },
  15: {
    name: "Возврат, отказ от получения: Не устроили сроки",
    provided: true,
  },
  16: {
    name: "Возврат, отказ от получения: Уже купил",
    provided: true,
  },
  17: {
    name: "Возврат, отказ от получения: Передумал",
    provided: true,
  },
  18: {
    name: "Возврат, отказ от получения: Ошибка оформления",
    provided: true,
  },
  19: {
    name: "Возврат, отказ от получения: Повреждение упаковки, у получателя",
    provided: true,
  },
  20: {
    name: "Частичная доставка",
    provided: true,
  },
  21: {
    name: "Возврат, отказ от получения: Нет денег",
    provided: true,
  },
  22: {
    name: "Возврат, отказ от получения: Товар не подошел(не понравился)",
    provided: true,
  },
  23: {
    name: "Возврат, истек срок хранения",
    provided: false,
  },
  24: {
    name: "Возврат, не прошел таможню",
    provided: false,
  },
  25: {
    name: "Возврат, не должен выполняться: является коммерческим грузом",
    provided: false,
  },
  26: {
    name: "Утерян",
    provided: false,
  },
  27: {
    name: "Не востребован, утилизация",
    provided: false,
  },
};

async function getDeliverySettings(projectionArr = ["api_settings"]) {
  try {
    const projection = {};
    if (projectionArr.length) {
      projectionArr.forEach((field) => {
        projection[field] = 1;
      });
    }

    const deliverysettings = await Deliverysettings.findOne(
      { vendor: "cdek" },
      projection
    );

    if (deliverysettings) {
      return deliverysettings;
    } else {
      throw "vendor: cdek не найден в БД";
    }
  } catch (e) {
    //  console.error(e);
    throw e;
  }
}

async function getOrderById(id, projectionArr = []) {
  try {
    let projection = {
      name: 1,
      cityId: 1,
      street: 1,
      house: 1,
      flat: 1,
      comment: 1,
      deliveryUuid: 1,
      deliveryStatus: 1,
      deliverySelect: 1,
      deliveryPrice: 1,
      deliveryPriceCourier: 1,
      deliveryPricePvz: 1,
      pvzCode: 1,
      payStatus: 1,
      orderNum: 1,
      phone: 1,
      cart: 1,
      createdAt: 1,
    };

    if (projectionArr.length) {
      projection = {};
      projectionArr.forEach((field) => {
        projection[field] = 1;
      });
    }

    const order = await Order.findById(id, projection);

    if (order) {
      return order;
    }
    throw new Error("Заказ по ID не найден");
  } catch (e) {
    // console.error(e);
    throw e;
  }
}

async function getProducts(cart, package_base) {
  try {
    const idsObj = {};
    cart.forEach((el) => {
      idsObj[el.product_id] = true;
    });
    const ids = Object.keys(idsObj);
    if (ids.length) {
      const products = await Product.find(
        { _id: { $in: ids } },
        { sku: 1, packages_id: 1 }
      ).populate({
        path: "packages_id",
        select: { _id: 0, weight: 1, length: 1, width: 1, height: 1 },
      });

      //length - Длина (в сантиметрах), width - Ширина (в сантиметрах), height - Высота (в сантиметрах)
      // weight - Общий вес (в граммах)
      if (products.length) {
        const packages = {
          weight: 0,
          length: 0,
          width: 0,
          height: 0,
        };

        const productsObj = {};
        products.forEach((item) => {
          const packages_item = item.packages_id
            ? item.packages_id
            : package_base;
          packages.weight += packages_item.weight;
          packages.height += packages_item.height;
          if (packages_item["length"] > packages["length"]) {
            packages["length"] = packages_item["length"];
          }
          if (packages_item.width > packages.width) {
            packages.width = packages_item.width;
          }
          productsObj[item._id] = {
            ware_key: `${item.sku}-${String(item._id).substr(-3)}`,
            packages: packages_item,
          };
        });
        return {
          productsObj,
          packages,
        };
      }

      throw new Error("Продукты не найдены");
    }

    throw new Error("Корзина заказа не содержит товаров");
  } catch (e) {
    // console.error(e);
    throw e;
  }
}

async function clearCacheauth() {
  try {
    await Cacheauth.deleteOne({ cacheKey: "cdek" });
  } catch (e) {
    throw e;
  }
}

async function clientAuthorization(api_settings = false, dev = false) {
  try {
    const candidate = await Cacheauth.findOne(
      { cacheKey: "cdek" },
      { _id: 0, cacheValue: 1 }
    );

    if (candidate) {
      axios.defaults.headers.common = {
        Authorization: `Bearer ${candidate.cacheValue}`,
      };
      return axios;
    }
    const oauthSettings = {
      url: "",
      grant_type: "client_credentials",
      client_id: "",
      client_secret: "",
    };

    if (dev) {
      //dev
      oauthSettings.url = "https://api.edu.cdek.ru/v2/oauth/token?parameters";
      oauthSettings.client_id = "z9GRRu7FxmO53CQ9cFfI6qiy32wpfTkd";
      oauthSettings.client_secret = "w24JTCv4MnAcuRTx0oHjHLDtyt3I6IBq";
    } else {
      //prodaction
      oauthSettings.url = "https://api.cdek.ru/v2/oauth/token?parameters";
      if (!api_settings) {
        const doc_api_settings = await getDeliverySettings();
        //     console.log('getDeliverySettings', doc_api_settings)
        oauthSettings.client_id = doc_api_settings.api_settings.client_id;
        oauthSettings.client_secret =
          doc_api_settings.api_settings.client_secret;
      } else {
        oauthSettings.client_id = api_settings.client_id;
        oauthSettings.client_secret = api_settings.client_secret;
      }
    }
    // console.log(oauthSettings)
    const getClientCredentials = oauth.client(axios.create(), oauthSettings);

    const auth = await getClientCredentials();
    // console.log(auth)
    if (auth.access_token) {
      axios.defaults.headers.common = {
        Authorization: `Bearer ${auth.access_token}`,
      };
      const doc = new Cacheauth({
        cacheKey: "cdek",
        cacheValue: auth.access_token,
      });
      await doc.save();
      return axios;
    } else {
      throw new Error("В ответе отсутствует access_token");
    }
  } catch (e) {
    console.error(e.message + " clientAuthorization");
    throw e;
  }
}

function orderValidate(order) {
  try {
    if (order.deliveryUuid) {
      throw new Error("Заказ уже зарегистирован в СДЕК " + order.deliveryUuid);
    }
    if (!order.cityId) {
      throw new Error("Не указан cityId");
    }
    if (order.name.length === 0) {
      throw new Error("Не указано ФИО получателя");
    }
    if (order.phone.length === 0) {
      throw new Error("Не указан телефон");
    }
    if (order.cart.length === 0) {
      throw new Error("В заказе отсутствуют товары");
    }
    if (
      order.deliverySelect === 0 &&
      order.street.length === 0 &&
      order.house.length === 0
    ) {
      throw new Error("Не указан адрес получателя");
    }
    if (order.deliverySelect === 1 && order.pvzCode.length === 0) {
      throw new Error("Не указан код ПВЗ получателя");
    }

    return true;
  } catch (e) {
    throw e;
  }
}

class OrderCdek {
  constructor(order, deliverysettings, products) {
    this.type = deliverysettings.type;
    this.number = order.orderNum;
    this.tariff_code =
      order.deliverySelect === 0
        ? deliverysettings.tariff_code_courier
        : deliverysettings.tariff_code_pvz;
    if (order.comment) {
      this.comment = order.comment;
    }
    if (deliverysettings.shipment_point) {
      this.shipment_point = deliverysettings.shipment_point;
    }
    if (order.deliverySelect === 1) {
      this.delivery_point = order.pvzCode;
    }
    this.items_cost_currency = deliverysettings.recipient_currency;
    this.recipient_currency = deliverysettings.recipient_currency;
    if (deliverysettings.date_invoice_send) {
      this.date_invoice = getDateStr(order.createdAt);
    }
    if (deliverysettings.shipper_send) {
      if (deliverysettings.shipper_name) {
        this.shipper_name = deliverysettings.shipper_name;
      }
      if (deliverysettings.shipper_address) {
        this.shipper_address = deliverysettings.shipper_address;
      }
    }
    // if (deliverysettings.shipper_name) {
    //     this.shipper_name = deliverysettings.shipper_name;
    // }
    // if (deliverysettings.shipper_address) {
    //     this.shipper_address = deliverysettings.shipper_address;
    // }
    this.delivery_recipient_cost = deliverysettings.delivery_recipient_cost;
    if (this.delivery_recipient_cost.vat_rate === "null") {
      this.delivery_recipient_cost.vat_rate = null;
    }

    if (!order.payStatus && order.deliveryPrice) {
      this.delivery_recipient_cost.value = order.deliveryPrice;
    } else {
      this.delivery_recipient_cost.value = 0;
    }

    if (deliverysettings.sender_status) {
      this.sender = {};
      const sender_phones = [];
      Object.keys(deliverysettings.sender).forEach((key_sender) => {
        if (
          deliverysettings.sender[key_sender] &&
          key_sender !== "$init" &&
          key_sender !== "phones"
        ) {
          this.sender[key_sender] = deliverysettings.sender[key_sender];
        } else if (key_sender === "phones") {
          deliverysettings.sender.phones.forEach((ph) => {
            const phObj = {
              number: ph,
            };
            sender_phones.push(phObj);
          });
        }
      });
      this.sender.phones = sender_phones;
    }
    if (deliverysettings.seller_status) {
      this.seller = {};
      Object.keys(deliverysettings.seller).forEach((key_seller) => {
        if (deliverysettings.seller[key_seller] && key_seller !== "$init") {
          this.seller[key_seller] = deliverysettings.seller[key_seller];
        }
      });
    }
    this.recipient = {};
    this.recipient.name = order.name;
    this.recipient.phones = [];
    const phone = "+" + order.phone;

    this.recipient.phones.push({
      number: phone,
    });
    //this.recipient.number = phone;
    this.from_location = {};
    this.from_location.code = deliverysettings.from_location.code
      ? deliverysettings.from_location.code
      : "";
    this.from_location.fias_guid = deliverysettings.from_location.fias_guid
      ? deliverysettings.from_location.fias_guid
      : "";
    this.from_location.postal_code = deliverysettings.from_location.postal_code
      ? deliverysettings.from_location.postal_code
      : "";
    this.from_location.longitude = deliverysettings.from_location.longitude
      ? deliverysettings.from_location.longitude
      : "";
    this.from_location.latitude = deliverysettings.from_location.latitude
      ? deliverysettings.from_location.latitude
      : "";
    this.from_location.country_code = deliverysettings.from_location
      .country_code
      ? deliverysettings.from_location.country_code
      : "";
    this.from_location.region = deliverysettings.from_location.region
      ? deliverysettings.from_location.region
      : "";
    this.from_location.sub_region = deliverysettings.from_location.sub_region
      ? deliverysettings.from_location.sub_region
      : "";
    this.from_location.city = deliverysettings.from_location.city
      ? deliverysettings.from_location.city
      : "";
    this.from_location.kladr_code = deliverysettings.from_location.kladr_code
      ? deliverysettings.from_location.kladr_code
      : "";
    this.from_location.address = deliverysettings.from_location.address
      ? deliverysettings.from_location.address
      : "";

    this.to_location = {};
    this.to_location.code = order.cityId;
    this.to_location.fias_guid = "";
    this.to_location.postal_code = "";
    this.to_location.longitude = "";
    this.to_location.latitude = "";
    this.to_location.country_code = deliverysettings.from_location.country_code;
    this.to_location.region = "";
    this.to_location.sub_region = "";
    this.to_location.city = "";
    this.to_location.kladr_code = "";
    this.to_location.address = "";
    if (order.deliverySelect === 0) {
      this.to_location.address = `${order.street}, ${order.house}`;
      if (order.flat) {
        this.to_location.address = `${this.to_location.address}, ${order.flat}`;
      }
    } else {
      this.to_location.address = `ПВЗ: ${order.pvzCode}`;
    }
    this.services = [];
    deliverysettings.services.forEach((el) => {
      const servItem = {
        code: el.code,
      };
      if (el.code === "PART_DELIV") {
        if (order.cart.length > 1) {
          this.services.push(servItem);
        }
      } else {
        this.services.push(servItem);
      }
    });
    this.packages = [];

    const packageOrder = {};
    packageOrder.number = order.orderNum;
    if (deliverysettings.packages_comment) {
      packageOrder.comment = deliverysettings.packages_comment;
    }
    packageOrder.weight = products.packages.weight;
    packageOrder["length"] = products.packages["length"];
    packageOrder.width = products.packages.width;
    packageOrder.height = products.packages.height;

    packageOrder.items = [];
    const productPackagesArr = [];
    const product_payment = deliverysettings.product_payment;
    if (product_payment.vat_rate === "null") {
      product_payment.vat_rate = null;
    }
    order.cart.forEach((product) => {
      productPackagesArr.push(
        products.productsObj[product.product_id].packages
      );
      let ware_key = products.productsObj[product.product_id].ware_key;
      if (product.level1_alias) {
        ware_key = `${ware_key}-${product.level1_alias}`;
      }
      if (product.level2_alias) {
        ware_key = `${ware_key}-${product.level2_alias}`;
      }

      const paymentItem = {
        value: order.payStatus ? 0 : product.price,
        vat_sum: product_payment.vat_sum,
        vat_rate: product_payment.vat_rate,
      };

      const productItem = {
        name: product.title,
        ware_key,
        payment: paymentItem,
        cost: product.price,
        weight: products.productsObj[product.product_id].packages.weight,
        weight_gross: products.productsObj[product.product_id].packages.weight,
        amount: product.qty,
      };

      // if (deliverysettings.url_item_product) {
      //     const baseApiUrl = process.env.BASE_URL || 'http://localhost:3000';
      //     productItem.url = baseApiUrl + product.link;
      // }
      packageOrder.items.push(productItem);
    });
    if (deliverysettings.package_one) {
      this.packages.push(packageOrder);
    } else {
      for (let i = 0; i < packageOrder.items.length; i++) {
        const packageItem = {};
        packageItem.number = order.orderNum + "-" + (i + 1);
        if (deliverysettings.packages_comment) {
          packageItem.comment = deliverysettings.packages_comment;
        }
        packageItem.weight = productPackagesArr[i].weight;
        packageItem["length"] = productPackagesArr[i]["length"];
        packageItem.width = productPackagesArr[i].width;
        packageItem.height = productPackagesArr[i].height;
        packageItem.items = [];
        packageItem.items.push(packageOrder.items[i]);
        this.packages.push(packageItem);
      }
    }
  }
}

async function orderRegistr(orderCdek, $axios, dev = false) {
  try {
    let url;
    if (dev) {
      // тестовая
      url = "https://api.edu.cdek.ru/v2/orders";
    } else {
      // боевая
      url = "https://api.cdek.ru/v2/orders";
    }

    $axios.defaults.headers.post["Content-Type"] = "application/json";
    const { data } = await $axios.post(url, JSON.stringify(orderCdek));

    return data;
  } catch (e) {
    await clearCacheauth();
    if (e.response) {
      if (e.response.status === 401) {
        return null;
      }
    }
    throw e;
  }
}

// Регистрация заказа
// Метод предназначен для создания в ИС СДЭК заказа на доставку товаров до покупателей.
module.exports.orderRegistration = async (order_id, dev = false) => {
  try {
    const order = await getOrderById(order_id);
    if (orderValidate(order)) {
      const deliverysettings = await getDeliverySettings([]);

      const products = await getProducts(
        order.cart,
        deliverysettings.package_base
      );
      const orderCdek = new OrderCdek(order, deliverysettings, products);

      let $axios = await clientAuthorization(
        deliverysettings.api_settings,
        dev
      );

      let data = await orderRegistr(orderCdek, $axios, dev);
      if (data === null) {
        $axios = await clientAuthorization(deliverysettings.api_settings, dev);
        data = await orderRegistr(orderCdek, $axios, dev);
        if (data === null) {
          throw new Error("Ошибка авторизации");
        }
      }

      if (data.entity.uuid) {
        order.deliveryUuid = data.entity.uuid;
        order.deliveryStatus = true;
        await order.save();
        const rezult = {
          uuid: data.entity.uuid,
          //shop_seller_name: data.shop_seller_name,
          //statuses: data.statuses,
          //errors: data.errors,
        };
        return rezult;
      }

      const request = data.requests[data.requests.length - 1];
      const message = request.warnings.length
        ? request.warnings[0].message
        : "Ошибка регистрации заказа";
      throw new Error(message);
    }
  } catch (e) {
    // console.error(e);
    // throw e.message
    throw e;
  }
};

async function delOrder(uuid, $axios, dev = false) {
  try {
    let url;
    if (dev) {
      // тестовая
      url = `https://api.edu.cdek.ru/v2/orders/${uuid}`;
    } else {
      // боевая
      url = `https://api.cdek.ru/v2/orders/${uuid}`;
    }

    const { data } = await $axios.delete(url);

    return data;
  } catch (e) {
    await clearCacheauth();
    if (e.response) {
      if (e.response.status === 401) {
        return null;
      }
    }
    throw e;
  }
}

// Удаление заказа по order_uuid
// Условием возможности удаления заказа является отсутствие движения груза на складе СДЭК (статус заказа «Создан»).
module.exports.deletingOrder = async (uuid, dev = false) => {
  try {
    const $axios = await clientAuthorization(false, dev);

    data = await delOrder(uuid, $axios, dev);
    if (data === null) {
      $axios = await clientAuthorization(false, dev);
      data = await delOrder(uuid, $axios, dev);
      if (data === null) {
        throw new Error("Ошибка авторизации");
      }
    }
    const request = data.requests[data.requests.length - 1];

    if (request.errors.length) {
      const message = request.warnings.length
        ? request.warnings[0].message
        : "Ошибка в ответе СДЕК";
      throw new Error(message);
    }

    const rezult = {
      uuid: data.entity.uuid,
    };
    return rezult;
  } catch (e) {
    throw e;
  }
};

// Удаление заказа по order_id
// Условием возможности удаления заказа является отсутствие движения груза на складе СДЭК (статус заказа «Создан»).
module.exports.deletingOrderByOrder = async (order_id, dev = false) => {
  try {
    const projection = ["deliveryUuid", "deliveryStatus"];
    const order = await getOrderById(order_id, projection);

    if (order.deliveryUuid) {
      const $axios = await clientAuthorization(false, dev);

      const uuid = order.deliveryUuid;
      data = await delOrder(uuid, $axios, dev);
      if (data === null) {
        $axios = await clientAuthorization(false, dev);
        data = await delOrder(uuid, $axios, dev);
        if (data === null) {
          throw new Error("Ошибка авторизации");
        }
      }

      const request = data.requests[data.requests.length - 1];

      if (request.errors.length) {
        const message = request.warnings.length
          ? request.warnings[0].message
          : "Ошибка в ответе СДЕК";
        throw new Error(message);
      }

      order.deliveryUuid = "";
      order.deliveryStatus = false;
      await order.save();

      const rezult = {
        uuid: data.entity.uuid,
        // statuses: data.statuses,
        // errors: data.errors,
      };

      return rezult;
    } else {
      throw new Error("Заказ не был зарегистрирован, удаление не возможно");
    }
  } catch (e) {
    throw e;
  }
};

async function statusOrder(uuid, $axios, dev = false) {
  try {
    let url;
    if (dev) {
      // тестовая
      url = `https://api.edu.cdek.ru/v2/orders/${uuid}`;
    } else {
      // боевая
      url = `https://api.cdek.ru/v2/orders/${uuid}`;
    }

    const { data } = await $axios.get(url);

    return data;
  } catch (e) {
    await clearCacheauth();
    if (e.response) {
      if (e.response.status === 401) {
        return null;
      }
    }
    throw e;
  }
}

// Информация о заказе
// Метод предназначен для получения детальной информации по заданному заказу.
module.exports.orderDetails = async (uuid, dev = false) => {
  try {
    const $axios = await clientAuthorization(false, dev);
    data = await statusOrder(uuid, $axios, dev);
    if (data === null) {
      $axios = await clientAuthorization(false, dev);
      data = await statusOrder(uuid, $axios, dev);
      if (data === null) {
        throw new Error("Ошибка авторизации");
      }
    }

    const statuses = data.entity.statuses.map((item) => {
      if (item.reason_code) {
        item.reason_name = addOrderStatuses[item.reason_code].name;
        item.reason_provided = addOrderStatuses[item.reason_code].provided;
      }
      return item;
    });
    // data.statuses = statuses;
    // console.log(data)
    const rezult = {
      uuid: data.entity.uuid,
      cdek_number: data.entity.cdek_number ? data.entity.cdek_number : "",
      statuses,
      errors: data.entity.errors,
      warnings: data.entity.warnings,
      shop_seller_name: data.entity.shop_seller_name,
    };

    return rezult;
  } catch (e) {
    throw e;
  }
};

async function creatingOrderRec(req, $axios, action = 1, dev = false) {
  try {
    let url;
    if (dev) {
      // тестовая
      if (action === 1) {
        url = `https://api.edu.cdek.ru/v2/print/orders`;
      } else {
        url = `https://api.edu.cdek.ru/v2/print/barcodes`;
      }
    } else {
      // боевая
      if (action === 1) {
        url = `https://api.cdek.ru/v2/print/orders`;
      } else {
        url = `https://api.cdek.ru/v2/print/barcodes`;
      }
    }

    $axios.defaults.headers.post["Content-Type"] = "application/json";
    const { data } = await $axios.post(url, JSON.stringify(req));

    return data;
  } catch (e) {
    await clearCacheauth();
    if (e.response) {
      if (e.response.status === 401) {
        return null;
      }
    }
    throw e;
  }
}

// Формирование квитанции к заказу - action=1 или action=2 - Формирование ШК-места к заказу
// Метод используется для формирования квитанции в формате pdf к заказу/заказам.
// Во избежание перегрузки платформы нельзя передавать более 100 номеров заказов в одном запросе.
module.exports.creatingOrderReceipt = async (
  order_uuid_arr,
  copy_count = 2,
  action = 1,
  byCdekNumber = false,
  dev = false
) => {
  try {
    // const cdek_number = '1155129609';
    //const order = { cdek_number };
    const name = byCdekNumber === true ? "cdek_number" : "order_uuid";
    const req = {
      orders: [],
      copy_count,
    };

    order_uuid_arr.forEach((el) => {
      const order = {}; // order_uuid: el
      order[name] = el;
      req.orders.push(order);
    });

    const $axios = await clientAuthorization(false, dev);
    data = await creatingOrderRec(req, $axios, action, dev);
    if (data === null) {
      $axios = await clientAuthorization(false, dev);
      data = await creatingOrderRec(req, $axios, action, dev);
      if (data === null) {
        throw new Error("Ошибка авторизации");
      }
    }

    const request = data.requests[data.requests.length - 1];

    if (request.errors.length) {
      const message = request.warnings.length
        ? request.warnings[0].message
        : "Ошибка в ответе СДЕК";
      throw new Error(message);
    }

    return data.entity;
  } catch (e) {
    throw e;
  }
};

async function receivingOrderRec(uuid, $axios, action = 1, dev = false) {
  try {
    let url;
    if (dev) {
      // тестовая
      if (action === 1) {
        url = `https://api.edu.cdek.ru/v2/print/orders/${uuid}`;
      } else {
        url = `https://api.edu.cdek.ru/v2/print/barcodes/${uuid}`;
      }
    } else {
      // боевая
      if (action === 1) {
        url = `https://api.cdek.ru/v2/print/orders/${uuid}`;
      } else {
        url = `https://api.cdek.ru/v2/print/barcodes/${uuid}`;
      }
    }

    const { data } = await $axios.get(url);

    return data;
  } catch (e) {
    await clearCacheauth();
    if (e.response) {
      if (e.response.status === 401) {
        return null;
      }
    }
    throw e;
  }
}

// Получение квитанции к заказу - action=1 или action=2 - Получение ШК-места к заказу
// Метод используется для получения ссылки на квитанцию в формате pdf к заказу/заказам.
// Ссылка на файл с квитанцией к заказу/заказам доступна в течение 1 часа.
// uuid - идентификатор квитанции, ссылку на которую необходимо получить, запрашивать creatingOrderReceipt
module.exports.receivingOrderReceipt = async (
  uuid,
  action = 1,
  dev = false
) => {
  try {
    const $axios = await clientAuthorization(false, dev);
    data = await receivingOrderRec(uuid, $axios, action, dev);
    if (data === null) {
      $axios = await clientAuthorization(false, dev);
      data = await receivingOrderRec(uuid, $axios, action, dev);
      if (data === null) {
        throw new Error("Ошибка авторизации");
      }
    }
    const endStatuse = data.entity.statuses[data.entity.statuses.length - 1];

    if (endStatuse.code === "READY" && data.entity.url) {
      if (/^http:/.test(data.url)) {
        data.url = data.url.replace(/^http:/, "https:");
      }

      const url = data.entity.url;
      const response = await $axios.get(url, {
        responseType: "arraybuffer",
        headers: {
          Accept: "application/pdf",
        },
      });

      //  console.log(url, endStatuse.name)
      //  console.log(response.data)

      return response.data;
    } else {
      throw new Error(
        "Документ еще не сформирован, текущий статус: " + endStatuse.name
      );
    }
  } catch (e) {
    throw e;
  }
};

// Привязка заказа по номеру накладной, через Формирование квитанции к заказу
// Отправляем номер накладной, получаем ответ, содержащий uuid заказа и uuid запроса.
// Вносим uuid заказа в order.
module.exports.creatingOrderReceiptByInvoice = async (
  order_id,
  dev = false
) => {
  try {
    const order_doc = await getOrderById(order_id, [
      "deliveryUuid",
      "deliveryStatus",
      "deliveryInvoice",
      "deliveryInvoiceHand",
    ]);

    if (order_doc.deliveryInvoice) {
      const order = {
        cdek_number: order_doc.deliveryInvoice,
      };
      const req = {
        orders: [order],
        copy_count: 2,
      };

      let $axios = await clientAuthorization(false, dev);
      let data = await creatingOrderRec(req, $axios, 1, dev);
      if (data === null) {
        $axios = await clientAuthorization(false, dev);
        data = await creatingOrderRec(req, $axios, 1, dev);
        if (data === null) {
          throw new Error("Ошибка авторизации");
        }
      }
      const uuid = data.entity.uuid;

      const rezult = await receivingOrderRec(uuid, $axios, 1, dev);

      if (rezult.entity.orders.length) {
        const order_uuid = rezult.entity.orders[0].order_uuid;

        if (order_uuid) {
          order_doc.deliveryUuid = order_uuid;
          order_doc.deliveryStatus = true;
          order_doc.deliveryInvoiceHand = false;
          await order_doc.save();
        }

        return data.entity;
      } else {
        const request = rezult.requests[rezult.requests.length - 1];
        const message = request.warnings.length
          ? request.warnings[0].message
          : "Заказ не найден по номеру";
        throw new Error(message);
      }
    } else {
      throw new Error("Номер накладной в заказе не введен");
    }
  } catch (e) {
    // console.error(e);
    // throw e.message
    throw e;
  }
};

// Получение списка ПВЗ по коду города
module.exports.getPvzListByCityId = async (city_code, dev = false) => {
  try {
    let url;
    if (dev) {
      // тестовая
      url = `https://api.edu.cdek.ru/v2/deliverypoints?city_code=${city_code}`;
    } else {
      // боевая
      url = `https://api.cdek.ru/v2/deliverypoints?city_code=${city_code}`;
    }

    $axios = await clientAuthorization(false, dev);
    const { data } = await $axios.get(url);

    return data;
  } catch (e) {
    // console.error(e);

    throw e;
  }
};
