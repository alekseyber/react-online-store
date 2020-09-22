const { model, Schema } = require('mongoose')
const formatDateStr = require('../middleware/format-date-str')

const commentSchema = new Schema({

    authorName: {
        type: String,
        default: ""
    },
    authorAvatar: {
        type: String,
        default: ""
    },
    authorProvider: {
        type: String,
        default: ""
    },
    authorUid: {
        type: String,
        default: ""
    },
    authorIp: {
        type: String,
        default: ""
    },
    status: {
        type: Boolean,
        default: false
    },
    htmlstatus: {
        type: Boolean,
        default: false
    },
    commenText: {
        type: String,
        default: "",
        maxlength: 1000
    },
    answer: {
        type: String,
        default: ""
    },
    datas: {
        type: Date,        
        default: Date.now
    }

}, {
    toObject: { virtuals: true },
    toJSON: { virtuals: true }
})

commentSchema.index({ datas: 1, type: -1 });

commentSchema.virtual('date').get((value, virtual, doc) => {
    return formatDateStr(doc.datas);
});


module.exports = model('comment', commentSchema)