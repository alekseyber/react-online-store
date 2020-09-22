const { model, Schema } = require('mongoose')

const cuponSchema = new Schema({

    cupontext: {
        type: String,
        index: true,
        unique: true,
        required: true,
        minlength: 5,
        maxlength: 12,
    },
    status: {
        type: Boolean,
        default: true
    },
    discontvalue: {
        type: Schema.Types.Decimal,
        required: true,
        min: 0.1,
        max: 1
    },
    description: {
        type: String,
        default: ""
    },
    expiryDate: {
        type: Date,
        default: Date.now,
        index: true
    }

})

cuponSchema.set('toJSON', {
    getters: true,
    transform: (doc, ret) => {
      if (ret.discontvalue) {
        ret.discontvalue = ret.discontvalue.toString();
      }
      delete ret.__v;
      return ret;
    },
  });

module.exports = model('cupon', cuponSchema)