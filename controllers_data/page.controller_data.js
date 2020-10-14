const Page = require("../models/page.model");
const SizesGroup = require("../models/sizesgroup.model");
const applyPattern = require("../middleware/apply-pattern");
const { NotFoundError, globalErrorCheck } = require("./errors.class");

module.exports.getPageByAlias = async (alias) => {
  try {
    const doc = await Page.findOne(
      { status: true, alias },
      { _id: 0, alias: 1, title: 1, content: 1, meta: 1 }
    );
    if (!doc) {
      throw new NotFoundError("Страница не найднеа");
    }

    let contData = {};
    contData.title = doc.title;
    contData.meta_title = doc.meta.title;
    contData.meta_description = doc.meta.description;
    contData.meta_keywords = doc.meta.keywords;
    contData.content = doc.content;
    contData = await applyPattern(contData, {});
    contData.alias = doc.alias;
    return contData;
  } catch (e) {
    globalErrorCheck(e);
  }
};

module.exports.getOfertaData = async () => {
  try {
    const doc = await Page.findOne({ oferta: true }, { _id: 0, content: 1 });

    if (!doc) {
      throw new NotFoundError("Документ не найден");
    }
    const contData = {
      content: doc.content,
    };

    return await applyPattern(contData, {});
  } catch (e) {
    globalErrorCheck(e);
  }
};

module.exports.getSizesChartData = async (sizesgroup_id) => {
  try {
    const content = await SizesGroup.findById(sizesgroup_id, { content: 1 });
    if (!content) {
      throw new NotFoundError("Документ не найден");
    }
    const rezult = {
      sizesgroupId: content._id,
      content: content.content,
    };
    return rezult;
  } catch (e) {
    globalErrorCheck(e);
  }
};
