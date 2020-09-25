import { SET_DELIVERY } from '../constants';
import { httpActions } from './../../hooks/http.hook';
import { showAlert } from './app';

export const setDelivery = (payload) => {

    return {
        type: SET_DELIVERY,
        payload
    }
}



export const pvzFetch = (cityid) => async (dispatch) => { //, getState
    const { requestNoErrMsg } = httpActions(dispatch);

    const errMsg = "Ошибка связи с сервером, повторите попытку позже";
    try {

        const pvzList = await requestNoErrMsg('/api/delivery/getpvzlist', 'get', { cityid });

        if (pvzList) {
            // rezult.city = city;
            // rezult.deliverySelect= 0;
            dispatch(setDelivery({ pvzList }));
        } else {
            dispatch(showAlert(errMsg, 'error'));
        }

    } catch (e) {
        dispatch(showAlert(errMsg, 'error'));
        //  console.error(e)
    }
}


export const deliveryFetch = (city) => async (dispatch) => { //, getState
    const { requestNoErrMsg } = httpActions(dispatch);
    const errMsg = "Ошибка связи с сервером, повторите попытку позже";
    try {

        const rezult = await requestNoErrMsg('/api/delivery/getdelivery', 'get', { cityid: city.id });

        if (rezult) {
            rezult.city = city;
            rezult.deliverySelect = 0;
            dispatch(setDelivery(rezult));
        } else {
            dispatch(showAlert(errMsg, 'error'));
        }

    } catch (e) {
        dispatch(showAlert(errMsg, 'error'));
        //  console.error(e)
    }
}