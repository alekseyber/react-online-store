const createOrderPdf = require('../middleware/create-order-pdf')


module.exports.getOrderPdf = async (req, res) => {
    try {

        const order_id = req.params.order_id;
        if (order_id) {
            const pdfDoc = await createOrderPdf(order_id);
            pdfDoc.getBuffer(function (buffer) {
                res.set('Content-Type', 'application/pdf');
                //res.set('Content-Disposition', 'attachment; filename=order.pdf');
                res.send(Buffer.from(buffer));
            });
        } else {
            res.status(404).send('Заказ не существует');
        }

    } catch (e) {
        console.error(e.message)
        res.status(500).send('Ошибка обработки на сервере');
    }
}