const { getCityMidel, getDeliveryMidel, getPvzListMidel } = require('../middleware/delivery');


module.exports.getCity = async (req, res) => {

    try {
        const rezult = await getCityMidel(req.query.citySaerch);
        res.status(200).json(rezult);
    } catch (e) {
        console.error(e);
    }

}


module.exports.getDelivery = async (req, res) => {

    try {
        const rezult = await getDeliveryMidel(req);
        res.status(200).json(rezult);

    } catch (e) {
        console.error(e.message);
        res.status(500).send(e.message);
    }
}


module.exports.getPvzList = async (req, res) => {

    try {

        const rezult = await getPvzListMidel(req.query.cityid);
        res.status(200).json(rezult);

    } catch (e) {
        console.error(e.message);
        res.status(404).send('Получена ошибка от внешнего API');
    }
}