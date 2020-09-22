const City = require('../models/city.model');
const Region = require('../models/region.model');


class Fields {
    constructor(item, itemRegionsObj) {
        this.id = item.ID;
        this.cityName = item.CityName;
        this.oblName = item.OblName;
        this.engName = item.EngName;
        this.countryCode = itemRegionsObj.countryCode;
        this.regionCode = itemRegionsObj.regionCode;
    }

}


module.exports = async (inputData) => {

    try {
        if (inputData.length) {
            const resultArr = [];
            const regionsDoc = await Region.find();
            const regionsObj = {};
            regionsDoc.forEach(el => {
                regionsObj[el.oblName] = {
                    countryCode: el.countryCode,
                    regionCode: el.regionCode,
                }
            })
            inputData.forEach(item => {
                if (item.OblName in regionsObj) {
                    const itemRes = new Fields(item, regionsObj[item.OblName])
                    resultArr.push(itemRes);
                }
            })
            if (resultArr.length) {
                await City.deleteMany();
                await City.insertMany(resultArr);
            }
        }
        return true

    } catch (e) {
        console.error(e);
        throw new Error(e.message);

    }

};