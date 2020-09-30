const News = require("../models/news.model");
const applyPattern = require("../middleware/apply-pattern");
const { DbError, NotFoundError, globalErrorCheck } = require("./errors.class");

module.exports.getAllData = async () => {
  try {
    return await News.find(
      { status: true },
      { _id: 0, alias: 1, title: 1, wtitle: 1, annonce: 1, img: 1 }
    ).sort({ update_at: -1 });
  } catch (e) {
    throw new DbError(e.message);
  }
};

module.exports.getByAliasData = async (alias) => {
  try {
    const doc = await News.findOne(
      { status: true, alias },
      { _id: 0, title: 1, annonce: 1, content: 1, meta: 1 }
    );

    if (!doc) {
      throw new NotFoundError();
    }

    let contData = {};
    contData["title"] = doc.title;
    contData["meta_title"] = doc.meta.title;
    contData["meta_description"] = doc.meta.description;
    contData["meta_keywords"] = doc.meta.keywords;
    contData["annonce"] = doc.annonce;
    contData["content"] = doc.content;
    contData = await applyPattern(contData, {});

    return contData;
  } catch (e) {
    globalErrorCheck(e);
  }
};
