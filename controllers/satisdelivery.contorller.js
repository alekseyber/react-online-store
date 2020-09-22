const geoip = require('geoip-lite');
const Region = require('../models/region.model');
const serviceCdek = require('../middleware/service-cdek')


module.exports.chekIp = async (req, res) => {
    try {

        //const action = req.body.action; //post
        const ip = req.query.ip; //get

        if (ip) {
            const geo = geoip.lookup(ip);

            if (geo) {
                const rezult = {
                    country: geo.country,
                    timezone: geo.timezone,
                    city: geo.city,
                    region: geo.region
                }
                const doc = await Region.findOne({ countryCode: geo.country, regionCode: geo.region }, { _id: 0, oblName: 1 });
                if (doc) {
                    rezult.region = doc.oblName
                }
                res.status(200).json(rezult);
            } else {
                res.status(404).send('IP не найден');
            }

        } else {
            res.status(400).send('IP не передан');
        }

    } catch (e) {
        console.error(e.message)
        res.status(500).send('Ошибка обработки на сервере');
    }
}


//===================
// true - режим dev
//===================


//Регистрация заказа по order_id
// post
module.exports.orderRegistration = async (req, res) => {
    try {

        const order_id = req.params.order_id;
        if (order_id) {
            const rezult = await serviceCdek.orderRegistration(order_id); //, true
            res.status(201).json(rezult);
        } else {
            res.status(404).send('order_id не передан');
        }

    } catch (e) {
        
        console.error(e.message)
        res.status(500).send(e.message);
    }
}

//Удаление заказа по order_uuid
// delete
module.exports.deletingOrder = async (req, res) => {
    try {

        const order_uuid = req.params.order_uuid;
        if (order_uuid) {
            const rezult = await serviceCdek.deletingOrder(order_uuid); //, true
            res.status(200).json(rezult);
        } else {
            res.status(404).send('order_uuid не передан');
        }

    } catch (e) {
        console.error(e.message)
        res.status(500).send(e.message);
    }
}

//Удаление заказа по order_id
// delete
module.exports.deletingOrderByOrder = async (req, res) => {
    try {

        const order_id = req.params.order_id;
        if (order_id) {
            const rezult = await serviceCdek.deletingOrderByOrder(order_id); //, true
            res.status(200).json(rezult);
        } else {
            res.status(404).send('order_id не передан');
        }

    } catch (e) {
        console.error(e.message)
        res.status(500).send(e.message);
    }
}

//Информация о заказе по order_uuid
// get
module.exports.orderDetails = async (req, res) => {
    try {

        const order_uuid = req.params.order_uuid;
        if (order_uuid) {
            const rezult = await serviceCdek.orderDetails(order_uuid); //, true
            //console.log(rezult)
            res.status(200).json(rezult);
        } else {
            res.status(404).send('order_id не передан');
        }

    } catch (e) {
        console.error(e.message)
        res.status(500).send(e.message);
    }
}

// Формирование квитанции к заказу - action=1 или action=2 - Формирование ШК-места к заказу по массиву order_uuid
// byCdekNumber=true - запрос будет по cdek_number
// (order_uuid_arr, copy_count = 2, action = 1, byCdekNumber = false, dev = false)
// post
module.exports.creatingOrderReceipt = async (req, res) => {
    try {

        const request = req.body;
        const byCdekNumber = (request.byCdekNumber === true) ? true : false;
        let copy_count = 2;
        if (request.copy_count) {
            copy_count = request.copy_count;
        }
        let action = 1;

        if (request.action) {
            action = Number(request.action);
        }
        // console.log('request', request, byCdekNumber, request.orders, action)
        if (request.orders) {
            const rezult = await serviceCdek.creatingOrderReceipt(request.orders, copy_count, action, byCdekNumber); //, 2,1, false, true

            res.status(200).json(rezult);
        } else {
            res.status(400).send('orders не переданы');
        }

    } catch (e) {
        console.error(e.message)
        res.status(500).send(e.message);
    }
}


// Получение квитанции к заказу - action=1 или action=2 - Получение ШК-места к заказу
// (uuid, action = 1, dev = false)
//uuid - идентификатор квитанции, ссылку на которую необходимо получить, запрашивать creatingOrderReceipt
// get
module.exports.receivingOrderReceipt = async (req, res) => {
    try {

        const uuid = req.params.uuid;
        const action = req.query.action ? Number(req.query.action) : 1;

        if (uuid) {
            const file = await serviceCdek.receivingOrderReceipt(uuid, action); // ,1, true
            if (file) {
                res.set('Content-Type', 'application/pdf');
               // res.set('Content-Disposition', 'attachment; filename=order.pdf');
                res.send(Buffer.from(file))
            } else {
                res.status(404).send('Файл не передан API CDEK'); 
            }

            // res.setHeader('Content-Type', 'application/pdf');
            // res.setHeader("Content-Disposition", "attachment; filename=" + "order.pdf");
            //  res.status(200).send(file);
        } else {
            res.status(404).send('uuid не передан');
        }

    } catch (e) {
        console.error(e.message)
        res.status(500).send(e.message);
    }
}

//Привязка заказа по номеру накладной, через Формирование квитанции к заказу
// put
module.exports.creatingOrderReceiptByInvoice = async (req, res) => {
    try {

        const order_id = req.params.order_id;
        if (order_id) {
            const rezult = await serviceCdek.creatingOrderReceiptByInvoice(order_id); //, true
            res.status(201).json(rezult);
        } else {
            res.status(404).send('order_id не передан');
        }

    } catch (e) {
        console.error(e.message)
        res.status(500).send(e.message);
    }
}