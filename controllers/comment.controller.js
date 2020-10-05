const {
  getCommentAllData,
  addCommentData,
} = require("../controllers_data/comment.controller_data");
const { getErrorStatus } = require("../controllers_data/errors.class");

module.exports.getAll = async (req, res) => {
  try {
    const docs = await getCommentAllData();

    res.status(200).json(docs);
  } catch (e) {
    getErrorStatus(e, res);
  }
};

module.exports.addComment = async (req, res) => {
  try {
    await addCommentData(req.body, req.ip);
  } catch (e) {
  } finally {
    res.status(201).send("OK");
  }
};
