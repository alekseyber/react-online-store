const Comment = require("../models/comment.model");
const verifyingGRecaptcha = require("../middleware/verifying-g-recaptcha");
const { sendAdminEmailAddComment } = require("../emails/sendmail");
const formatDateStr = require("../middleware/format-date-str");
const { RecaptchaError, DbError, globalErrorCheck } = require("./errors.class");

// const detectIP = (req) => {
//   return (
//     (req.headers["x-forwarded-for"] || "").split(",").pop() ||
//     req.connection.remoteAddress ||
//     req.socket.remoteAddress ||
//     req.connection.socket.remoteAddress
//   );
// };

module.exports.getAllData = async () => {
  try {
    return await Comment.find(
      { status: true },
      {
        _id: 0,
        authorName: 1,
        commenText: 1,
        answer: 1,
        datas: 1,
        htmlstatus: 1,
      }
    ).sort({ datas: -1 });
  } catch (e) {
    throw new DbError();
  }
};

module.exports.addCommentData = async (inputData, authorIp) => {
  try {
    const recaptchaStatus = await verifyingGRecaptcha(
      inputData.recaptchaToken,
      authorIp
    );
    if (recaptchaStatus) {
      const authorName = String(inputData.authorName.trim());
      const commenText = String(inputData.commenText.trim());
      const rezultObj = { authorName, commenText, authorIp };
      const newComment = new Comment(rezultObj);
      const doc = await newComment.save();
      rezultObj.dateStr = formatDateStr();
      sendAdminEmailAddComment(rezultObj);
      return rezultObj;
    } else {
      throw new RecaptchaError();
    }
  } catch (e) {
    globalErrorCheck(e);
  }
};
