const Params = require("../models/params.model");
const Order = require("../models/order.model");
const fs = require("fs");
const path = require("path");
const moment = require("moment");

function strTrim(str, searchValue = "/") {
  if (str.indexOf(searchValue) === 0) {
    str = str.substring(1);
  }
  if (str.substr(-1, 1) === searchValue) {
    str = str.substring(0, str.length - 1);
  }

  return str;
}
async function getParams() {
  try {
    const doc = await Params.findOne(
      { select: true },
      {
        _id: 0,
        logoimg: 1,
        shop_name: 1,
        shop_name_rus: 1,
        phone: 1,
        currSymbol: 1,
        baseUrl: 1,
        orderPrintText: 1,
      }
    );
    if (doc) {
      return doc;
    }
    throw new Error("Ошибка получения зи БД данных о магазине");
  } catch (e) {
    console.error(e);
    throw e;
  }
}

function isFileDoesExist(path) {
  try {
    fs.accessSync(path, fs.constants.R_OK);
    return true;
  } catch (e) {
    throw e;
  }
}

function getImgAsBase64(pathImg) {
  try {
    const img = strTrim(pathImg);
    let destination = path.resolve(__dirname, "../", "static");

    const arrTemp = img.split("/");
    arrTemp.forEach((el) => {
      destination = path.join(destination, el);
    });

    if (!isFileDoesExist(destination)) return false;

    const imageAsBase64 = fs.readFileSync(destination, "base64");
    return imageAsBase64;
  } catch (e) {
    console.error(e.message);
  }
}

async function getOrderById(id) {
  try {
    let projection = {
      orderNum: 1,
      phone: 1,
      name: 1,
      cityName: 1,
      oblName: 1,
      street: 1,
      house: 1,
      flat: 1,
      comment: 1,
      deliveryPrice: 1,
      summa: 1,
      cart: 1,
      createdAt: 1,
    };

    const order = await Order.findById(id, projection);

    if (order) {
      return order;
    }
    new Error("Заказ по ID не найден");
  } catch (e) {
    throw e;
  }
}

function getStartdocDefinition(params, order) {
  return (docDefinition = {
    info: {
      title: `Заказ № ${order.orderNum} от ${moment(order.createdAt).format(
        "DD.MM.YYYY"
      )}`,
      author: params.shop_name,
      subject: "",
      keywords: "",
    },
    pageSize: "A4",
    pageMargins: [30, 30, 30, 30],
  });
}

function getOrderContet(params, order) {
  const logoImg = getImgAsBase64(params.logoimg);
  const dd = {
    content: [],
    styles: {
      header: {
        fontSize: 18,
        bold: true,
      },
      tableExample: {
        margin: [0, 15, 0, 15],
      },
      tableHeader: {
        bold: true,
        fontSize: 11,
        color: "black",
        fillColor: "#eeeeee",
      },
      bottomleft: {
        fontSize: 10,
      },
      paragraf: {
        margin: [0, 0, 0, 10],
      },
    },
  };

  const cart = [
    [
      { text: "Поз", style: "tableHeader", fontSize: 10 },
      { text: "Наименование товара", style: "tableHeader" },
      { text: `Цена, ${params.currSymbol}`, style: "tableHeader" },
      { text: "Кол-во", style: "tableHeader", fillColor: "#eeeeee" },
      { text: `К оплате, ${params.currSymbol}`, style: "tableHeader" },
      { text: "Кол-во вручен", style: "tableHeader" },
    ],
  ];

  for (let i = 0; i < order.cart.length; i++) {
    const item = [
      `${i + 1}.`,
      { text: order.cart[i].title, fontSize: 11 },
      { text: order.cart[i].price, alignment: "right" },
      { text: order.cart[i].qty, alignment: "right" },
      { text: order.cart[i].itemSumm, alignment: "right" },
      "",
    ];
    cart.push(item);
  }

  const productSumm = [
    {
      colSpan: 4,
      text: `Итого товаров на сумму, ${params.currSymbol}`,
      bold: true,
    },
    "",
    "",
    "",
    {
      colSpan: 2,
      text: order.summa,
      alignment: "right",
    },
    "",
  ];
  cart.push(productSumm);

  const divelSumm = [
    {
      colSpan: 4,
      text: `Доставка, ${params.currSymbol}`,
      bold: true,
    },
    "",
    "",
    "",
    {
      colSpan: 2,
      text: order.deliveryPrice,
      alignment: "right",
    },
    "",
  ];
  cart.push(divelSumm);

  const summ = [
    {
      colSpan: 4,
      text: `Итого, ${params.currSymbol}`,
      bold: true,
    },
    "",
    "",
    "",
    {
      colSpan: 2,
      text: order.summa + order.deliveryPrice,
      bold: true,
      alignment: "right",
    },
    "",
  ];
  cart.push(summ);

  const imgPrefix = /\.png$/.test(logoImg)
    ? "data:image/png;base64,"
    : "data:image/jpg;base64,";

  const topColums = [
    {
      qr: String(order._id),
      fit: "50",
    },
    {
      stack: [{ text: order.cityName, style: "header" }, order.oblName],
      width: 170,
    },
  ];

  const image = logoImg ? imgPrefix + logoImg : "";
  if (image) {
    topColums.unshift({
      image,
      width: 90,
    });
  }

  dd.content = [
    {
      alignment: "center",
      columns: topColums,
    },
    {
      style: "tableExample",
      table: {
        widths: [300, "*"],
        tableCellPadding: 5,
        body: [
          [
            {
              border: [true, true, true, false],
              fillColor: "#eeeeee",
              text: "ПРОДАВЕЦ",
              bold: true,
            },
            {
              border: [true, true, true, false],
              fillColor: "#eeeeee",
              text: "ИНФОРМАЦИЯ О ЗАКАЗЕ",
              bold: true,
            },
          ],
          [
            {
              border: [true, false, true, false],
              stack: [
                {
                  text: [
                    {
                      text: "Компания: ",
                      bold: true,
                    },
                    params.shop_name_rus,
                    ", тел: ",
                    params.phone.title,
                    ", сайт: ",
                    { text: params.baseUrl, link: params.baseUrl },
                  ],
                },
              ],
            },
            {
              rowSpan: 5,
              border: [true, false, true, true],
              stack: [
                {
                  margin: [0, 5, 0, 5],
                  text: [
                    {
                      text: "Заказ № ",
                      bold: true,
                    },
                    order.orderNum,
                    " от ",
                    moment(order.createdAt).format("DD.MM.YYYY"),
                  ],
                },
                {
                  text: "Заметки: ",
                  bold: true,
                },
                {
                  style: "bottomleft",
                  text: order.comment,
                },
              ],
            },
          ],
          [
            {
              border: [true, false, true, false],
              fillColor: "#eeeeee",
              text: "ПОКУПАТЕЛЬ",
              bold: true,
            },
            "",
          ],
          [
            {
              border: [true, false, true, false],
              stack: [
                {
                  text: [
                    {
                      text: "ФИО: ",
                      bold: true,
                    },
                    order.name,
                  ],
                },
              ],
            },
            "",
          ],
          [
            {
              border: [true, false, true, false],
              stack: [
                {
                  text: [
                    {
                      text: "Телефон: ",
                      bold: true,
                    },
                    "+" + order.phone,
                  ],
                },
              ],
            },
            "",
          ],
          [
            {
              border: [true, false, true, true],
              stack: [
                {
                  text: [
                    {
                      text: "Адрес: ",
                      bold: true,
                    },
                    `${order.street}, ${order.house}, ${order.flat}`,
                  ],
                },
              ],
            },
            "",
          ],
        ],
      },
    },
    {
      style: "tableExample",
      table: {
        headerRows: 1,
        widths: [25, "*", 52, 38, 60, 45],
        body: cart,
      },
      layout: {
        hLineWidth: function (i, node) {
          return i === 0 || i === node.table.body.length ? 2 : 1;
        },
        vLineWidth: function (i, node) {
          return i === 0 || i === node.table.widths.length ? 2 : 1;
        },
        hLineColor: function (i, node) {
          return i === 0 || i === node.table.body.length ? "black" : "gray";
        },
        vLineColor: function (i, node) {
          return i === 0 || i === node.table.widths.length ? "black" : "gray";
        },
      },
    },
    {
      alignment: "left",
      margin: [5, 0, 5, 0],
      columns: [
        {
          style: "bottomleft",
          stack: [
            {
              style: "paragraf",
              text: "Проверяйте комплектацию и внешний вид товара во время его получения! Покупатель самостоятельно несет ответственность за внешний вид и комплектацию товара после приема его от продавца.",
            },
            params.orderPrintText,
          ],
        },
        {
          stack: [
            {
              text: [
                {
                  text: "Итого получено:",
                  bold: true,
                },
                "_______________________________",
              ],
            },
            {
              margin: [0, 5, 0, 5],
              text: [
                {
                  style: "bottomleft",
                  text: "Доставлено полностью, претензий не имею.",
                },
              ],
            },
            {
              margin: [0, 0, 0, 15],
              style: "bottomleft",
              text: "ПОДТВЕРЖДЕНИЕ ДОСТАВКИ",
              bold: true,
            },
            {
              style: "bottomleft",
              text: 'Дата "_____" _________________.________ время ____:_____',
            },
            {
              margin: [0, 15, 0, 0],
              style: "bottomleft",
              text: "ПОЛУЧАТЕЛЬ__________________________________________",
              bold: true,
            },
          ],
        },
      ],
    },
    // {
    //     margin: [0, 10, 0, 0],
    //     table: {
    //         widths: ['*'],

    //         body: [
    //             [
    //                 {
    //                     border: [false, false, false, true],
    //                     style: 'bottomleft',
    //                     text: ''
    //                 }

    //             ]
    //         ]
    //     }
    // },
  ];
  return dd;
}

function createPdfBinary(docDefinition) {
  try {
    const pdfMake = require("pdfmake/build/pdfmake.js");
    const pdfFonts = require("pdfmake/build/vfs_fonts.js");
    pdfMake.vfs = pdfFonts.pdfMake.vfs;
    const pdfDoc = pdfMake.createPdf(docDefinition);
    return pdfDoc;
  } catch (e) {
    throw e;
  }
}

module.exports = async (order_id) => {
  try {
    const params = await getParams();
    const order = await getOrderById(order_id);
    const docDefinition = getStartdocDefinition(params, order);
    const dd = getOrderContet(params, order);
    docDefinition.content = dd.content;
    docDefinition.styles = dd.styles;

    return createPdfBinary(docDefinition);
  } catch (e) {
    // console.error(e);
    throw e;
  }
};
