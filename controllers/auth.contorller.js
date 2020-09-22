const bcrypt = require('bcrypt-nodejs');
const jwt = require('jsonwebtoken');
const keys = require('../keys');
const User = require('../models/user.model');
const { sendAdminEmailResetPassword } = require('../emails/sendmail');

module.exports.login = async (req, res) => {
    try {

        const candidate = await User.findOne({ login: req.body.login, status: true })
        if (candidate) {
            const isPasswordCorrect = bcrypt.compareSync(req.body.password, candidate.password)
            if (isPasswordCorrect) {
                const token = jwt.sign({
                    login: candidate.login,
                    userId: candidate._id
                }, keys.JWT, { expiresIn: 60 * 60 * 8 })
                res.json({ token })
            } else {
                res.status(404).send('Пользователь не найден');
                // res.status(404).json({ message: 'Пользователь не найден' })
            }
        } else {
            res.status(404).send('Пользователь не найден');
            // res.status(404).json({ message: 'Пользователь не найден' })
        }
    } catch (e) {
        console.error(e)
        // res.status(500).json({ message: e.message })
        res.status(500).send(e.message);
    }
}

module.exports.createUser = async (req, res) => {
    try {

        const candidate = await User.findOne({ login: req.body.login })
        if (candidate) {
            res.status(409).send('Пользователь с таким именем уже существует');
            //  res.status(409).json({ message: 'Пользователь с таким именем уже существует' })
        } else {
            const salt = bcrypt.genSaltSync(10)
            const user = new User({
                login: req.body.login,
                password: bcrypt.hashSync(req.body.password, salt),
                email: req.body.email,
                notes: req.body.notes
            })

            await user.save();
            const newUser = {
                _id: user._id,
                login: user.login,
                status: user.status,
                email: user.email,
                notes: user.notes
            }
            res.status(201).json(newUser)
        }
    } catch (e) {
        console.error(e)
        res.status(500).send(e.message);
        // res.status(500).json({ message: e.message })
    }
}

module.exports.editPassword = async (req, res) => {
    try {
        const _id = req.body._id;
        const doc = await User.findById(_id, { pasword: 1 });
        if (!doc) {
            res.status(409).send('Пользователь с таким ID не найден');
        } else {
            const salt = bcrypt.genSaltSync(10);
            doc.password = bcrypt.hashSync(req.body.password, salt);
            await doc.save();
            res.status(200).send('Пароль изменен успешно')
        }
    } catch (e) {
        console.error(e)
        res.status(500).send(e.message);
        // res.status(500).json({ message: e.message })
    }
}


const getRandomInt = max => Math.floor(Math.random() * Math.floor(max));


module.exports.resetPassword = async (req, res) => {
    try {
        const doc = await User.findOne({ login: req.body.login })

        if (doc) {
            if (doc.email) {
                const salt = bcrypt.genSaltSync(10);
                const timeInMs = Date.now();

                const newPasswordCandidat = bcrypt.hashSync(timeInMs + getRandomInt(10), salt);
                const start = getRandomInt(15);
                const password = newPasswordCandidat.slice(start, (start + 10));

                doc.password = bcrypt.hashSync(password, salt);
                await doc.save();

                const email = doc.email;
                const login = doc.login;
               // console.log('newPassword', password);
                const rezultObj = { password, email, login };
                sendAdminEmailResetPassword(rezultObj);
            }
        }
        res.status(200).send('Пароль сброшен')
    } catch (e) {
        console.error(e)
        res.status(500).send('Серверная ошибка, повторите попытку позже');
    }
}