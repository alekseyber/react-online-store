const getModel = require("../models/requireModel");
const { Types } = require("mongoose");
const getCountFormMongo = require("../middleware/get-count-form-mongo");
const parseShema = require("../middleware/parse-shema");
const { productAmountUpdate } = require("../middleware/product-amount-update");
const getStatistic = require("../middleware/get-statistic");

function getProjection(projection) {
  const rezult = {};
  try {
    if (projection !== undefined && projection) {
      projection = String(projection).split(",");
      if (projection) {
        projection.forEach((el) => {
          rezult[el] = true;
        });
      }
    }
  } catch (e) {
    console.error(e.message);
  }
  return rezult;
}

function getFilter(filter) {
  const rezult = {
    filter: {},
    err: true,
  };
  try {
    if (filter !== undefined) {
      filter = JSON.parse(String(filter));
      if (typeof filter === "object" && filter !== null) {
        if (Object.keys(filter).length > 0) {
          rezult.filter = filter;
          rezult.err = false;
        }
      }
    }
  } catch (e) {
    console.error(e.message);
  }
  return rezult;
}

module.exports.getListModel = async (req, res) => {
  try {
    //  const modelName = req.query.modelName;
    const modelName = req.params.modelName;
    const Model = getModel(modelName);
    let projection = getProjection(req.query.projection);

    if (!Model) {
      res.status(404).send("Модель не существует или не передана");
    } else {
      if (modelName === "user") {
        projection = { login: 1, status: 1, email: 1, notes: 1 };
      }

      if (modelName === "order") {
        const docsOrder = await Model.find({}, projection).sort({
          createdAt: -1,
        });
        return res.status(200).json(docsOrder);
      }
      const docs = await Model.find({}, projection);

      res.status(200).json(docs);
    }
  } catch (e) {
    console.error(e.message);
    res.status(500).send(e.message);
  }
};

module.exports.getListModelsArray = async (req, res) => {
  try {
    const paramsarrayJson = req.query.paramsarray;

    if (!paramsarrayJson) {
      res.status(400).send("Запрос не передан");
    }
    const paramsarray = JSON.parse(paramsarrayJson);
    const rezult = {};
    let status = true;
    let msg = "";
    for (const item of paramsarray) {
      const Model = getModel(item.modelName);
      const projection = getProjection(item.projection);
      if (!Model) {
        status = false;
        msg = `Модель ${item.modelName} не существует или не передана`;

        break;
      } else {
        const docs = await Model.find({}, projection);
        rezult[item.modelName] = docs;
      }
    }
    if (status) {
      res.status(200).json(rezult);
    } else {
      res.status(404).send(msg);
    }
  } catch (e) {
    console.error(e.message);
    res.status(500).send(e.message);
  }
};

module.exports.getItemByIdModel = async (req, res) => {
  try {
    //  const modelName = req.query.modelName;
    const modelName = req.params.modelName;

    const Model = getModel(modelName);
    //  const _id = req.query._id;
    const _id = req.params._id;
    let projection = getProjection(req.query.projection);

    if (Model && _id !== undefined) {
      if (modelName === "user") {
        projection = { login: 1, status: 1, email: 1, notes: 1 };
      }
      const doc = await Model.findById(_id, projection);
      if (doc) {
        res.status(200).json(doc);
      } else {
        res.status(404).send("Не найдено по ID");
      }
    } else {
      res.status(404).send("Модель не существует или данные не переданы");
    }
  } catch (e) {
    console.error(e.message);
    res.status(500).send(e.message);
  }
};

module.exports.getCountFromModel = async (req, res) => {
  try {
    const modelName = req.params.modelName;
    const filter = getFilter(req.query.filter);

    const count = await getCountFormMongo(modelName, filter.filter);
    res.status(200).json(count);
  } catch (e) {
    console.error(e.message);
    res.status(500).send(e.message);
  }
};

module.exports.getCheckUniqFromModel = async (req, res) => {
  try {
    const modelName = req.params.modelName;
    const _id = req.query._id;
    const path = req.query.path;
    const value = req.query.value;
    if (path !== undefined && value !== undefined && modelName !== undefined) {
      const rezult = { unique: false };
      const filter = {};
      filter[path] = value;
      if (_id !== undefined) {
        if (_id.length) {
          filter._id = { $ne: _id };
        }
      }
      const count = await getCountFormMongo(modelName, filter);
      if (count.count === 0) {
        rezult.unique = true;
      }

      res.status(200).json(rezult);
    } else {
      res.status(400).send("Данные не переданы");
    }
  } catch (e) {
    console.error(e);
    res.status(500).send(e.message);
  }
};

const fielsdBytrue = {
  bparams: "select",
  mainpage: "main",
  ordernumber: "status",
  params: "select",
};

module.exports.getItemModelByField = async (req, res) => {
  try {
    const modelName = req.params.modelName;

    let field = req.query.field;
    // let field = req.params.field;
    const Model = getModel(modelName);
    const filter = {};
    const projection = getProjection(req.query.projection);

    if (Model) {
      if (field === undefined) {
        if (modelName in fielsdBytrue) {
          filter[fielsdBytrue[modelName]] = true;
          field = fielsdBytrue[modelName];
        }
      } else {
        filter[field] = true;
      }
      if (Object.keys(filter).length === 1) {
        const doc = await Model.findOne(filter, projection);
        if (doc) {
          const newDoc = doc.toObject(); //.filter(el => el !== field);
          if (field in newDoc) {
            delete newDoc[field];
          }
          res.status(200).json(newDoc);
        } else {
          res.status(404).send("Не найдено по заданным критериям");
        }
      } else {
        res.status(404).send("Не поля SELECT для данной модели");
      }
    } else {
      res.status(400).send("Модель не существует или данные не переданы");
    }
  } catch (e) {
    console.error(e);
    res.status(500).send(e.message);
  }
};

async function orderPostUpdate(order_id, newOrderStatus_id) {
  return await productAmountUpdate(order_id, newOrderStatus_id);
}

module.exports.editModel = async (req, res) => {
  try {
    const modelName = req.params.modelName;
    // const modelName = req.body.modelName;
    const Model = getModel(modelName);
    const _id = req.params._id;
    // const _id = req.body._id;
    const formData = req.body.formData;
    const noJsonRezult = req.body.noJsonRezult === undefined ? true : false;

    if (Model && _id !== undefined && formData !== undefined) {
      //   const doc = await Model.findByIdAndUpdate(_id, { $set: formData }, { new: true });
      const proection = {};
      Object.keys(formData).forEach((el) => {
        if (
          el !== "_id" &&
          el !== "__v" &&
          el !== "createdAt" &&
          el !== "update_at"
        ) {
          proection[el] = true;
        }
      });

      const doc = await Model.findById(_id, proection);
      if (doc) {
        let saveAction = false;
        const orderObj = {
          order_id: "",
          orderStatus_id: "",
          status: false,
        };
        if (modelName === "order") {
          if (doc.orderStatus_id && formData.orderStatus_id) {
            if (
              String(doc.orderStatus_id) !== String(formData.orderStatus_id)
            ) {
              orderObj.order_id = _id;
              orderObj.orderStatus_id = doc.orderStatus_id;
              orderObj.status = true;
            }
          }
        }

        Object.keys(formData).forEach((el) => {
          if (el in doc) {
            if (!saveAction) saveAction = true;
            doc[el] = formData[el];
          }
        });
        if (saveAction) {
          await doc.save();

          if (orderObj.status) {
            orderPostUpdate(orderObj.order_id, orderObj.orderStatus_id);
          }

          if (noJsonRezult) {
            res.status(200).send("Изменения сохранены");
          } else {
            res.status(200).json(doc);
          }
        } else {
          res.status(404).send("Поля formData не найдены");
        }
      } else {
        res.status(404).send("Данные не найдены по ID");
      }
    } else {
      res.status(404).send("Модель не найдена или данные не переданы");
    }
  } catch (e) {
    console.error(e);
    res.status(500).send(e.message);
  }
};

module.exports.deleteModelById = async (req, res) => {
  try {
    // const modelName = req.query.modelName;
    const modelName = req.params.modelName;
    const Model = getModel(modelName);
    const _id = req.params._id;
    //  const _id = req.query._id;

    if (Model && _id !== undefined) {
      // const doc = await Model.findByIdAndDelete(_id);
      const deleteResponse = await Model.deleteOne({
        _id: Types.ObjectId(_id),
      });
      //console.log('deleteResponse', deleteResponse)
      if (deleteResponse.deletedCount) {
        res.status(200).send("Удаление успешно");
      } else {
        res.status(404).send("Не найден по _id");
      }
    } else {
      res.status(404).send("Модель не найдена или данные не переданы");
    }
  } catch (e) {
    console.error(e.message);
    res.status(500).send(e.message);
  }
};

module.exports.createModel = async (req, res) => {
  try {
    // console.log('models', models)
    const modelName = req.params.modelName;
    const Model = getModel(modelName);
    if (Model) {
      //console.log(req.body.formData)
      const formData = req.body.formData;
      if (formData !== undefined) {
        const doc = new Model(formData);
        await doc.save();
        res.status(201).json(doc);
      } else {
        res.status(400).send("Данные не переданы");
      }
    } else {
      res.status(404).send("Модель не найдена");
    }
  } catch (e) {
    console.error(e.message);
    res.status(500).send(e.message);
    // res.status(500).json({ message: e.message })
  }
};

module.exports.getShemaModel = async (req, res) => {
  try {
    //  const modelName = req.query.modelName;
    const modelName = req.params.modelName;
    const Model = getModel(modelName);
    if (Model) {
      const rezult = parseShema(Model);
      res.status(200).json(rezult);
    } else {
      res.status(404).send("Модель не найдена");
    }
  } catch (e) {
    console.error(e.message);
    res.status(500).send(e.message);
  }
};

module.exports.getFieldsModel = async (req, res) => {
  try {
    const Models = getModel("", true);
    const rezult = {};
    if (Models) {
      rezult.models = Object.keys(Models);
      rezult.modelFields = {};

      rezult.models.forEach((modelName) => {
        rezult.modelFields[modelName] = Object.keys(
          Models[modelName].schema.paths
        ).filter((field) => field !== "_id" && field !== "__v");
      });
      res.status(200).json(rezult);
    } else {
      res.status(404).send("Модели не найдены");
    }
  } catch (e) {
    console.error(e.message);
    res.status(500).send(e.message);
  }
};

module.exports.getListModelByIds = async (req, res) => {
  try {
    const modelName = req.params.modelName;
    const Model = getModel(modelName);
    let projection = getProjection(req.query.projection);
    const ids = req.query.ids;

    const idsArr = String(ids).split(",");
    if (idsArr.length || modelName !== "user" || Model) {
      const docs = await Model.find({ _id: { $in: idsArr } }, projection);
      res.status(200).json(docs);
    } else {
      res.status(404).send("Ids нет в массиве или модели существует");
    }
  } catch (e) {
    console.error(e.message);
    res.status(500).send(e.message);
  }
};

module.exports.getSatisStatistic = async (req, res) => {
  try {
    const grupp = req.params.grupp;

    if (grupp !== "all") {
      //const oneGrupp = {};
      const oneRezult = await getStatistic[grupp]();
      //oneGrupp[grupp] = oneRezult;
      return res.status(200).json(oneRezult);
    }

    const statisticArrGrupp = [
      "product",
      "order",
      "news",
      "comment",
      "acquirer",
      "category",
      "ordergraf",
    ];
    const gruppsRezult = {};

    for (let i = 0; i < statisticArrGrupp.length; i++) {
      const rezult = await getStatistic[statisticArrGrupp[i]]();
      gruppsRezult[statisticArrGrupp[i]] = rezult;
    }

    res.status(200).json(gruppsRezult);
  } catch (e) {
    console.error(e);
    res.status(500).send(e.message);
  }
};
