const axios = require('axios');
const qs = require('qs');
const Externalapikey = require('../models/externalapikey.model');


module.exports = async (clientToken, remoteip = false) => {

    // const tempResponse = {
    //     "success": false,
    //     "challenge_ts": new Date(),
    //     "hostname": "",
    //     "error-codes": []
    // }

    try {
        const gRecaptchaKey = await Externalapikey.findOne({ vendor: 'grecaptcha' });

        if (gRecaptchaKey) {
            const url = gRecaptchaKey.valueStr;
            let params = {
                secret: gRecaptchaKey.secretkey,
                response: clientToken
            }
            if (remoteip) {
                params.remoteip = remoteip; 
            }

            const response = await axios.post(
                url, qs.stringify(params));
            //console.log('gRecaptchaParams', params);
            //console.log('gRecaptcha', response.data);
            return response.data.success


        } else {
            return false;
        }

    } catch (e) {
        console.error(e);
        return false;
    }

};