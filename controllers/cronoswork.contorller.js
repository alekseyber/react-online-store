const getWork = require('../cronos/requireCronos');
const Cronos = require('../models/cronos.model');



async function apllyWorkByName(work) {
    try {
        const Work = getWork(work);
        if (Work) {
            const rezult = await Work();
            return rezult;
        } else {
            throw new Error('Функция не найдена');
        }

    } catch (e) {
        throw e
    }
}

async function getCronosById(id, auth = true) {
    try {
        const cronos = await Cronos.findById(id);

        if (cronos) {
            // console.log(id, cronos, auth)
            if (auth === true) {
                if ((cronos.auth === true) || (cronos.status === false)) {
                    return false
                }
            }
            return cronos.work;
        }
        return false
    } catch (e) {
        throw e
    }
}

module.exports.workNoAuth = async (req, res) => {
    try {

        const _id = req.params._id;
        if (_id) {
            const cronosWork = await getCronosById(_id);
            if (cronosWork) {
                const rezult = await apllyWorkByName(cronosWork);
                let status = 200;
                if (rezult.status) {
                    status = rezult.status;
                }
                res.status(status).json(rezult);
            } else {
                res.status(404).send('Не существует');
            }

        } else {
            res.status(404).send('Не существует');
        }

    } catch (e) {
        // console.error(e.message)
        res.status(500).send(e.message);
    }
}


module.exports.workAuth = async (req, res) => {
    try {

        const _id = req.params._id;
        if (_id) {
            const cronosWork = await getCronosById(_id, false);
            if (cronosWork) {
                const rezult = await apllyWorkByName(cronosWork);
                // console.log('workAuth', rezult)
                let status = 200;
                if (rezult.status) {
                    status = rezult.status;
                }

                res.status(status).json(rezult);
            } else {
                res.status(404).send('Не существует в БД');
            }

        } else {
            res.status(404).send('Не существует');
        }

    } catch (e) {
        console.error(e)
        res.status(500).send(e.message);
    }
}