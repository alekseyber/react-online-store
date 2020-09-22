const Comment = require('../models/comment.model');
const verifyingGRecaptcha = require('../middleware/verifying-g-recaptcha');
const { sendAdminEmailAddComment } = require('../emails/sendmail');
const formatDateStr = require('../middleware/format-date-str');

function detectIP(req) {
    //=====================================
    const ip = (req.headers['x-forwarded-for'] || '').split(',').pop() ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress;
    //======================================
    return ip
}


module.exports.getAll = async (req, res) => {
    try {
        const docs = await Comment.find({ status: true }, { _id: 0, authorName: 1, commenText: 1, answer: 1, datas: 1, htmlstatus: 1 }).sort({ datas: -1 });

        res.status(200).json(docs)

    } catch (e) {
        console.error(e.message);
        res.status(500).send('Получена ошибка БД');
    }

}


module.exports.addComment = async (req, res) => {

    try {
        const inputData = req.body;
        const authorIp = detectIP(req);
        const recaptchaStatus = await verifyingGRecaptcha(inputData.recaptchaToken, authorIp);
        if (recaptchaStatus) {

            const authorName = String(inputData.authorName.trim());
            const commenText = String(inputData.commenText.trim());
            let rezultObj = { authorName, commenText, authorIp };
            const newComment = new Comment(rezultObj);
            const doc = await newComment.save();
            rezultObj.dateStr = formatDateStr();
            sendAdminEmailAddComment(rezultObj);

        }

    } catch (e) {
        //   e.message
        console.error(e.message);

    } finally {
        res.status(201).send('OK');
    }
}


