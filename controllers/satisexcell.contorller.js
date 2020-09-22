const XLSX = require('xlsx');
const exportImport = require('../middleware/export-import-excell');

const getAction = action => {

    const actions = ['product', 'productamount', 'productmodif', 'citycdek'];

    if (action) {
        if (actions.findIndex(el => el === action) >= 0) {
            return action
        }
    }
    return false;
}



module.exports.uploadSingle = async (req, res) => {
    try {
        const file = req.file;
        const action = getAction(req.params.action);

        if (file && action) {
            if (file.mimetype === 'application/vnd.ms-excel' || file.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
                const fileBuffer = file.buffer;
                const wb = XLSX.read(fileBuffer, { type: 'buffer' });
                const sheet_name_list = wb.SheetNames;
                const xlData = XLSX.utils.sheet_to_json(wb.Sheets[sheet_name_list[0]]);

                const fun = exportImport[`import${action}`];

                const rezult = await fun(xlData);

                //console.log(xlData[0])

                res.status(rezult.status).json(rezult);
            } else {
                res.status(400).send('Ошибка mimetype - не соответствует excell');
            }
        } else {
            res.status(400).send('Файл или action не передан');
        }

    } catch (e) {
        console.error(e.message)
        res.status(500).send(e.message);
    }
}



module.exports.loadExcell = async (req, res) => {
    try {

        const action = getAction(req.params.action);

        if (action) {
            const fun = exportImport[`export${action}`];
            const inputArr = await fun();
            const ws = XLSX.utils.json_to_sheet(inputArr);
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, 'export');
            res.setHeader('Content-Type', 'application/vnd.openxmlformats');
            res.setHeader("Content-Disposition", "attachment; filename=" + action + "_export.xlsx");
            res.status(200).send(XLSX.write(wb, { type: 'buffer' }));

        } else {
            res.status(404).send('Action не существует');
        }

    } catch (e) {
        console.error(e.message)
        res.status(500).send(e.message);
    }
}