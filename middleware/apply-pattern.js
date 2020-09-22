const Params = require('../models/params.model')

function regItemApply(inputData = {}, itemPattern = "", itemReplace = "") {
   
    itemPattern = "@" + itemPattern + "@";
    const pattern = new RegExp(itemPattern, 'g');
    Object.keys(inputData).forEach(key => {
        if (inputData[key] !== undefined) {
            inputData[key] = inputData[key].replace(pattern, itemReplace);
        }
    })
    return inputData
}


module.exports = async (inputData = {}, addPattern = {}) => {
    const docParams = await Params.findOne({ select: true }, { _id: 0, "phone.title": 1, shop_name: 1, shop_name_rus: 1, shop_fullname_rus: 1, currSymbol: 1, streetAddress: 1, shop_email: 1 });
    addPattern['shop_tel'] = docParams.phone.title;
    addPattern['shop_name'] = docParams.shop_name;
    addPattern['shop_name_rus'] = docParams.shop_name_rus;
    addPattern['shop_fullname_rus'] = docParams.shop_fullname_rus;
    addPattern['streetAddress'] = docParams.streetAddress;
    addPattern['shop_email'] = docParams.shop_email;
    addPattern['curr_symbol'] = docParams.currSymbol;
    addPattern['cur_symbol_right'] = ' ' + docParams.currSymbol;
    Object.keys(addPattern).forEach(key => {
        inputData = regItemApply(inputData, key, addPattern[key])
    })
    
    return inputData;
};




