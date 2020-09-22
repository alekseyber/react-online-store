const axios = require('axios');
const md5 = require('js-md5');
const geoip = require('geoip-lite');
const Deliverysettings = require('../models/deliverysettings.model');
const City = require('../models/city.model');
const Region = require('../models/region.model');
const formatDateStr = require('./format-date-str');


const getGeoCityId = async req => {

    let rezult = { id: 44, cityName: "Москва", oblName: "Москва" };

    try {

        //=====================================
        const ip = (req.headers['x-forwarded-for'] || '').split(',').pop() ||
            req.connection.remoteAddress ||
            req.socket.remoteAddress ||
            req.connection.socket.remoteAddress;
        //======================================

        // const ip = "93.100.247.68"; //СПб
        //const ip = "94.154.89.201"; //Глазов
        // const ip = "85.26.233.40"; //Самара
        //const ip = "213.151.2.44"; //Нижний Тагил
        //const ip = "176.59.110.227"; //Ульяновск
        //const ip = "80.89.151.102"; //Новосибирск
        // const ip = "217.30.243.226"; //Казань


        const geo = geoip.lookup(ip);
        //console.log(geo)
        if (geo) {
            if (geo.region !== "MOW" && geo.country === "RU" && geo.region) {
                if (geo.city === 'St Petersburg') {
                    geo.city = 'Saint Petersburg'
                }
                const cityPattern = geo.city.trim().replace(/\s+/, '.+').toLowerCase();

                const qwery = {
                    engName: {
                        $regex: new RegExp('^' + cityPattern, 'i')
                    },
                    countryCode: geo.country,
                    regionCode: geo.region
                }
                const doc = await City.findOne(qwery, { _id: 0, id: 1, cityName: 1, oblName: 1 });
                if (doc) {
                    rezult.id = doc.id;
                    rezult.cityName = doc.cityName;
                    rezult.cityName = doc.cityName;
                    rezult.oblName = doc.oblName;
                } else {

                    const qweryToo = {
                        countryCode: geo.country,
                        regionCode: geo.region
                    }
                    const docToo = await Region.findOne(qweryToo, { _id: 0, id: 1, cityName: 1, oblName: 1 });
                    if (docToo) {
                        rezult.id = docToo.id;
                        rezult.cityName = docToo.cityName;
                        rezult.oblName = docToo.oblName;
                    }
                }
                //console.log(rezult)
            }
        }
    } catch (e) {
        console.error(e);
    }

    return rezult
}

module.exports.getCityMidel = async (citySaerch) => {

    let rezult = [];

    try {

        if (citySaerch) {
            q = String(citySaerch.trim());
            q = q.replace(/[^а-яА-Я0-9 ]/g, "");
            q = q.replace(/\s{2,}/g, " ");

            if (q.length > 2) {
                q = '^' + q;
                const $regex = new RegExp(q, 'i');
                rezult = await City.find({ cityName: { $regex } }, { _id: 0, id: 1, cityName: 1, oblName: 1 }).sort({ cityName: 1 }).limit(8);

            }
        }
    } catch (e) {
        console.error(e);
    }
    return rezult
}


module.exports.getDeliveryMidel = async (req) => {

    try {
        let receiverCityId = Number(req.query.cityid);
        let city = { id: 0, cityName: '' };
        if (isNaN(receiverCityId)) {
            city = await getGeoCityId(req);
            receiverCityId = city.id;
        }

        if (receiverCityId) {

            const deliverySettings = await Deliverysettings.findOne({ vendor: 'cdek' }, {
                _id: 0,
                tariff_code_courier: 1,
                tariff_code_pvz: 1,
                from_location: 1,
                package_base: 1,
                api_settings: 1,
                priceAdd: 1
            });
            if (deliverySettings) {
                const senderCityId = Number(deliverySettings.from_location.code);
                let currentDate = new Date();
                currentDate.setDate(currentDate.getDate() + 1);
                if (currentDate.getDay() === 0) {
                    currentDate.setDate(currentDate.getDate() + 1);
                }
                const priceAdd = Number(deliverySettings.priceAdd);

                const dateExecute = currentDate.getFullYear() + '-' + ('0' + (currentDate.getMonth() + 1)).slice(-2) + '-' + ('0' + currentDate.getDate()).slice(-2);
                const authLogin = deliverySettings.api_settings.client_id;
                let secure = deliverySettings.api_settings.client_secret;
                secure = md5(dateExecute + '&' + secure);
                //    const url = "https://api.cdek.ru/calculator/calculate_tarifflist.php"; //Расчет стоимости по тарифам без приоритета  Content-Type: application/json
                const url = "https://api.cdek.ru/calculator/calculate_tarifflist.php"; //Расчет стоимости по тарифам без приоритета  Content-Type: application/json
                const version = "1.0";


                let goods = [];

                goods[0] = {
                    length: deliverySettings.package_base.length,
                    width: deliverySettings.package_base.width,
                    height: deliverySettings.package_base.height,
                    weight: (deliverySettings.package_base.weight / 1000)
                };
                // goods[0] = {
                //     length: 38,
                //     width: 32,
                //     height: 14,
                //     weight: 1,
                //     volume: 0.017
                // };
                const tariffId = deliverySettings.tariff_code_courier; // Посылка склад-дверь
                //const tariffId = 137; // Посылка склад-дверь
                // const tariffId = 233 // курьер Экономичная посылка склад-дверь
                // const tariffId = 234 // PVZ Экономичная посылка склад-склад       
                // const tariffId = 136 // PVZ Посылка склад-склад           
                let params = { version, authLogin, secure, dateExecute, senderCityId, receiverCityId, tariffId, goods }

                let rezult = {
                    courier: false,
                    pvz: false,
                    status: false,
                    errMsg: "",
                    cityid: receiverCityId,
                    city: city
                };
                const response = await axios.post(
                    url, params
                );

                if ("error" in response.data) {
                    rezult.errMsg = response.data.error[0].text;
                } else {
                    if ("result" in response.data) {
                        rezult.status = true;
                        rezult.courier = response.data.result;
                        rezult.courier.priceByCurrency += priceAdd;
                        rezult.courier.deliveryDateMin = formatDateStr(rezult.courier.deliveryDateMin, false);
                        rezult.courier.deliveryDateMax = formatDateStr(rezult.courier.deliveryDateMax, false);
                    } else {
                        rezult.errMsg = "Ответ внешнего API содержит ошибку";
                    }
                }

                if (rezult.status) {
                    params.tariffId = deliverySettings.tariff_code_pvz;
                    //params.tariffId = 136;
                    const responsePVZ = await axios.post(
                        url, params
                    );

                    if ("result" in responsePVZ.data) {
                        rezult.pvz = responsePVZ.data.result;
                        rezult.pvz.priceByCurrency += priceAdd;
                        rezult.pvz.deliveryDateMin = formatDateStr(rezult.pvz.deliveryDateMin, false);
                        rezult.pvz.deliveryDateMax = formatDateStr(rezult.pvz.deliveryDateMax, false);
                    }
                    return rezult;
                } else {
                    throw new Error(rezult.errMsg);
                }
            } else {

                throw new Error('Получена ошибка apiKey');
            }
        } else {
            throw new Error('Код города не передан');

        }

    } catch (e) {
        console.error(e.message);
        throw new Error('Получена ошибка от внешнего API');
    }
}


module.exports.getPvzListMidel = async (cityid) => {


    cityid = Number(cityid);

    if (cityid) {
        const url = "https://integration.cdek.ru/pvzlist/v1/xml";
        const allowedcod = "1";
        const params = {
            cityid, allowedcod
        }
        try {
            const responseXml = await axios.get(
                url, { params }
            );
            if (responseXml.data.length > 0) {
                const xml = String(responseXml.data);
                const parseString = require('xml2js').parseString;
                let self = this;
                parseString(xml, function (err, result) {
                    //    console.log(err); //null                   
                    if (err === null) {
                        self.events = result
                    }

                });

                const rezult = self.events;
                let rezultObj = {
                    cityid: cityid,
                    pvz: false
                }
                if ("PvzList" in rezult) {
                    // console.dir(JSON.stringify(rezult.PvzList));
                    rezultObj.pvz = rezult.PvzList.Pvz
                    return rezultObj;
                } else {
                    throw new Error('ПВЗ отсутствуют');
                }

            } else {
                throw new Error('ПВЗ отсутствуют');
            }

        } catch (e) {
            throw new Error('Получена ошибка от внешнего API');
        }

    }
    throw new Error('Код города не передан');
}

