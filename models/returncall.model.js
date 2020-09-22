const { model, Schema } = require('mongoose')




const returncallSchema = new Schema({

    phone: {
        type: String,
        required: true,
        index: true,
    },
    name: {
        type: String,
        default: "",
        maxlength: 100
    },
    user_ip: {
        type: String,
        default: ""
    },
    comment: {
        type: String,
        default: "",
        maxlength: 1000
    },
    commentAdmin: {
        type: String,
        default: ""
    },
    status: {
        type: Boolean,
        default: false
    },
    // date: {
    //     type: Date,
    //     default: Date.now,
    //     index: true
    // }
},
    {
        timestamps: { createdAt: 'createdAt' },
        timestamps: { updatedAt: 'update_at' }
    }
);

returncallSchema.index({ update_at: 1, type: -1 });


module.exports = model('returncall', returncallSchema)