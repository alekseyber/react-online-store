class Field {
  constructor(schematype, modelName) {
    this.path = schematype.path;
    this.instance = schematype.instance;
    this.disabled = false;

    if (modelName in noEditStatus) {
      if (this.path in noEditStatus[modelName]) {
        this.disabled = true;
      }
    }

    if ("validators" in schematype) {
      const validators = [];
      const self = this;
      schematype.validators.forEach((el) => {
        const item = {
          message: String(self.getMessage(el.message)),
          type: el.type,
        };
        validators.push(item);
      });
      if (validators.length > 0) {
        this.validators = validators;
      }
    }
    if ("unique" in schematype.options) {
      if (schematype.options.unique) {
        this.unique = schematype.options.unique;
      }
    }

    if ("minLength" in schematype.options) {
      this.minLength = schematype.options.minLength;
    }

    if ("maxLength" in schematype.options) {
      this.maxLength = schematype.options.maxLength;
    }
    if ("min" in schematype.options) {
      if (schematype.options.min != null) {
        this.min = schematype.options.min;
      }
    }

    if ("max" in schematype.options) {
      if (schematype.options.max != null) {
        this.max = schematype.options.max;
      }
    }

    const enumValue = this.getEnum(schematype);
    if (Array.isArray(enumValue)) {
      if (enumValue.length) {
        this.enum = enumValue;
      }
    }
    if (modelName in userEnum) {
      if (this.path in userEnum[modelName]) {
        this.userEnum = userEnum[modelName][this.path];
        this.userEnumRef = userEnum[modelName][this.path].ref;
      }
    }

    switch (schematype.instance) {
      case "String":
        this.value =
          "defaultValue" in schematype ? schematype.defaultValue : "";
        if (modelName in imgField) {
          if (this.path in imgField[modelName]) {
            this.imgField = imgField[modelName][this.path];
          }
        }
        // if (modelName in colorPicker) {
        //     if (this.path in colorPicker[modelName]) {
        //         this.colorPicker = colorPicker[modelName][this.path];
        //     }
        // }
        this.type = "text";
        if (modelName in typeText) {
          if (this.path in typeText[modelName]) {
            this.type = typeText[modelName][this.path];
          }
        }

        break;

      case "Number":
        this.value = "defaultValue" in schematype ? schematype.defaultValue : 0;
        break;
      case "Date":
        this.value =
          "defaultValue" in schematype ? new Date().toISOString() : null;

        if (
          schematype.path === "createdAt" ||
          schematype.path === "update_at"
        ) {
          this.type = "timestamps";
          this.labeltext =
            schematype.path === "createdAt" ? "Создан" : "Изменен";
        } else {
          this.type = "datepicker";
        }
        break;
      case "Boolean":
        this.value =
          "defaultValue" in schematype ? schematype.defaultValue : false;
        break;
      case "ObjectID":
        if (this.path !== "_id") {
          if ("defaultValue" in schematype) {
            this.value = schematype.defaultValue;
          } else {
            this.value = null;
          }
          const objectIDRef = schematype.options.ref.modelName;

          if (objectIDRef !== undefined) {
            this.ref = objectIDRef;
          } else if (schematype.options.ref !== undefined) {
            if (typeof schematype.options.ref === "string") {
              this.ref = schematype.options.ref;
            }
          }
        }

        break;
      case "Array":
        this.schema = "schema" in schematype;
        this.addStatus = true;
        this.delStatus = true;

        if (modelName in arrNoDelEl) {
          if (this.path in arrNoDelEl[modelName]) {
            this.delStatus = false;
          }
        }

        if (this.schema) {
          let pathnameprefix = "";
          if (/\./.test(this.path)) {
            const fields = this.path.split(".");
            for (let i = 0; i < fields.length - 1; i++) {
              pathnameprefix += fields[i] + ".";
            }
          }
          this.array = parseShema(schematype, modelName, pathnameprefix);
          this.table = false;
          if (modelName in arrayTable) {
            if (this.path in arrayTable[modelName]) {
              this.table = true;
            }
          }
          if (modelName in imgArrField) {
            if (this.path in imgArrField[modelName]) {
              this.imgArrField = imgArrField[modelName][this.path];
            }
          }
        } else {
          //  this.array = new Field(schematype.caster, modelName);
          this.arrayInstance = schematype.caster.instance;
          this.value =
            "default" in schematype.options ? schematype.options.default : [];
          if (this.arrayInstance === "ObjectID") {
            const arrayObjectIDRef = schematype.caster.options.ref.modelName;
            if (arrayObjectIDRef !== undefined) {
              this.ref = arrayObjectIDRef;
            } else if (schematype.caster.options.ref !== undefined) {
              if (typeof schematype.caster.options.ref === "string") {
                this.ref = schematype.caster.options.ref;
              }
            }
          }
        }

        break;
    }

    const regexObj = new RegExp(/\./g);
    if (regexObj.test(this.path)) {
      this.levels = this.path.split(".");
      this.level = this.levels.length;
    }
  }
  getEnum(schematype) {
    if ("enum" in schematype.options) {
      // if (schematype.options.enum.length > 0) {
      return schematype.options.enum;
      //   }
    }
    return [];
  }

  getMessage(inputText) {
    const pattern = new RegExp(/`{PATH}`/, "g");
    return inputText.replace(pattern, this.path);
  }
}

function parseShema(Model, modelName, pathnameprefix = "") {
  const schema = {};
  const excluded = ["_id", "__v"]; //, 'update_at', 'createdAt'
  Model.schema.eachPath((pathname, schematype) => {
    if (excluded.indexOf(pathname) === -1) {
      schema[pathnameprefix + pathname] = new Field(schematype, modelName);
    }
  });

  return schema;
}

// выводить на клиенте в виде таблицы
const arrayTable = {
  order: {
    cart: true,
  },
};
// пользовательские списки, когда поле не objectId / value - поле / grtitle - если есть группа (дерево)
// where - когда нужно выбрать по критерию [0] - критерий в этой коллекции, [1] - равен полю в коллекции доноре
// nowhere - исключить текущие по полю
const userEnum = {
  product: {
    filter: {
      ref: "filter",
      value: "attrs.alias_attrs",
      title: "attrs.title",
      grtitle: "title",
    },
    level1_alias: {
      ref: "colors",
      value: "children.aliasitem",
      title: "children.title",
    },
    level2_alias: {
      ref: "sizes",
      value: "alias",
      title: "title",
      where: ["sizesgroup_id", "group"],
    },
    color_default: {
      ref: "product",
      value: "children.aliasitem",
      title: "children.aliasitem",
    },
  },
  order: {
    level1_alias: {
      ref: "colors",
      value: "children.aliasitem",
      title: "children.title",
    },
    level2_alias: {
      ref: "sizes",
      value: "alias",
      title: "title",
    },
  },
};
// текстовые поля, которые являются img, если true - возможность загрузки, в противном только отображение
const imgField = {
  topslider: {
    imgLogo: true,
    imgBackground: true,
  },
  product: {
    img: true,
  },
  category: {
    img: true,
    smimg: true,
  },
  brand: {
    img: true,
  },
  order: {
    img: false,
  },
  params: {
    logoimg: true,
  },
  mainpage: {
    imgBacgr: true,
  },
};
// Array объектов, которые содержат img для групповой загрузки
const imgArrField = {
  product: {
    gallery: true,
  },
};

// 'Array' this.schema = true - запрещено удалять элемент
const arrNoDelEl = {
  colors: {
    children: true,
  },
};

// Поля запрещенные для редактирования после создания
const noEditStatus = {
  colors: {
    aliasitem: true,
  },
  filter: {
    alias_attrs: true,
  },
  sizes: {
    alias: true,
  },
  sizesgroup: {
    nosize: true,
  },
};

//Типы для текстовых полей по имени варианты: colorpicker, 'textarea', 'htmledit', 'phone', 'email', 'password', 'ipadress' если не задано, то text по умолчанию- настройка

const typeText = {
  acquirer: {
    phone: "phone",
    description: "textarea",
  },
  bparams: {
    "product_meta.description": "textarea",
    adminEmail: "email",
    "emailSettings.fromEmail": "email",
    textReturnProduct: "htmledit",
  },
  brand: {
    description: "textarea",
    content: "textarea",
  },
  category: {
    promo: "textarea",
    content: "htmledit",
    "meta.description": "textarea",
  },
  comment: {
    commenText: "textarea",
    authorIp: "ipadress",
  },
  cupon: {
    description: "textarea",
  },
  mainpage: {
    promo: "textarea",
    content: "htmledit",
    "meta.description": "textarea",
  },
  news: {
    annonce: "htmledit",
    content: "htmledit",
    "meta.description": "textarea",
  },
  order: {
    phone: "phone",
    comment: "textarea",
    deliveryComment: "textarea",
    acquirer_ip: "ipadress",
    commentAdmin: "textarea",
  },
  page: {
    content: "htmledit",
    "meta.description": "textarea",
  },
  params: {
    shop_email: "email",
    textDeliveryProduct: "textarea",
    defaultDeliveryText: "textarea",
    defaultDeliverySmallText: "textarea",
    orderDoneText: "textarea",
    defaultDeliveryRegionText: "textarea",
    orderPrintText: "textarea",
  },
  product: {
    content: "htmledit",
    "meta.description": "textarea",
  },
  returncall: {
    phone: "phone",
    comment: "textarea",
    commentAdmin: "textarea",
    user_ip: "ipadress",
  },
  returnproduct: {
    phone: "phone",
    commentAdmin: "textarea",
    acquirer_ip: "ipadress",
  },
  sizes: {
    description: "textarea",
  },
  sizesgroup: {
    content: "htmledit",
  },
  user: {
    password: "password",
    email: "email",
    notes: "textarea",
  },
  colors: {
    colorkey: "colorpicker",
  },
  bagde: {
    colorkey: "colorpicker",
  },
  topslider: {
    altLogo: "colorpicker",
    maxHeightBackground: "colorpicker",
    topString2: "textarea",
  },
};

module.exports = (Model) => {
  if (Model) {
    const modelName = Model.modelName;
    return parseShema(Model, modelName);
  }
};
