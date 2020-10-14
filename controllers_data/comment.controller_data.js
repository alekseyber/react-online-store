const Comment = require("../models/comment.model");
const verifyingGRecaptcha = require("../middleware/verifying-g-recaptcha");
const { sendAdminEmailAddComment } = require("../emails/sendmail");
const formatDateStr = require("../middleware/format-date-str");
const {
  RecaptchaError,
  DbError,
  globalErrorCheck,
  SuccessClass,
} = require("./errors.class");

module.exports.getCommentAllData = async () => {
  try {
    const list = await Comment.find(
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
    return { list };
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
      await newComment.save();
      rezultObj.dateStr = formatDateStr();
      sendAdminEmailAddComment(rezultObj);
      const rezult = new SuccessClass("Спасибо, комментарий получен.");

      return rezult;
    } else {
      throw new RecaptchaError();
    }
  } catch (e) {
    globalErrorCheck(e);
  }
};
