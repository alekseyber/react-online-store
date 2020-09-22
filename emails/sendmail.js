const Email = require('email-templates');
const Bparams = require('../models/bparams.model')
const path = require('path');

function validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}


async function sendMail(lecolsData = {}, template = "orderadminemail", to = false, addbaseUrl = true) {

    try {
        const docParams = await Bparams.findOne({ select: true }, { _id: 0, shopName: 1, emailSettings: 1, adminEmail: 1, saendAdminEmail: 1, currSymbol: 1 });
        //baseUrl: 1, 
        
        let sendStatus = true;
        if (docParams === null) {
            throw "Ошибка отрпавки E-mail. Не получены параметры из БД.";
        }

        if (addbaseUrl) {
            // lecolsData.baseUrl = docParams.baseUrl;
            lecolsData.baseUrl = process.env.BASE_URL || 'http://localhost:3000';
        }

        lecolsData.shopName = docParams.shopName;
        lecolsData.currSymbol = docParams.currSymbol

        if (to === false) {
            to = docParams.adminEmail;
            if (docParams.saendAdminEmail === false) {
                sendStatus = false;
            }
        }

        if (!validateEmail(to)) {
            throw `Ошибка отрпавки E-mail. E-mail ${to} не прошел валидацию.`;
        }

        if (sendStatus) {
            const email = new Email({
                message: {
                    from: `${lecolsData.shopName} <${docParams.emailSettings.fromEmail}>`
                },
                send: true,
                preview: false,
                // transport: {
                //     jsonTransport: true
                // },
                transport: {
                    pool: true,
                    host: docParams.emailSettings.host,
                    port: docParams.emailSettings.port,
                    secure: docParams.emailSettings.secure, // use TLS
                    auth: {
                        user: docParams.emailSettings.auth_user,
                        pass: docParams.emailSettings.auth_pass
                    }
                },

            });

            email
                .send({
                    template: path.join(__dirname, template),
                    message: { to },
                    locals: lecolsData
                })
                .then(
                    // console.log('email - OK')
                )
                .catch(console.error);
        }


    } catch (e) {
        console.error(e);
    }
}


module.exports.sendAdminEmailFromOrder = async (order) => {
    try {
        sendMail(order);
    } catch (e) {
        //console.error(e);
    }
}

module.exports.sendAdminEmailReturnProduct = async (lecolsData) => {
    try {
        sendMail(lecolsData, 'returnproductmail');
    } catch (e) {
        // console.error(e);
    }
}

module.exports.sendAdminEmailReturnCall = async (lecolsData) => {
    try {
        sendMail(lecolsData, 'returncallmail');
    } catch (e) {
        // console.error(e);
    }
}

module.exports.sendAdminEmailAddComment = async (lecolsData) => {
    try {
        sendMail(lecolsData, 'addcomment');
    } catch (e) {
        // console.error(e);
    }
}

module.exports.sendAdminEmailResetPassword = async (lecolsData) => {
    try {
        sendMail(lecolsData, 'resetpasswordmail', lecolsData.email);
    } catch (e) {
        // console.error(e);
    }
}
