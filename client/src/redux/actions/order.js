import { batch } from 'react-redux';
import { SET_ORDER_VALUE, SET_ORDER } from '../constants';
import { useHttp } from './../../hooks/http.hook';
import { showAlert } from './app';
import { hideDialog } from './modaldialog';
import { cartUpdate } from './cart';
import { history } from '../store';

export const setOrder = (payload) => {

    return {
        type: SET_ORDER,
        payload
    }
}

export const setOrderValue = (name, value) => {

    return {
        type: SET_ORDER_VALUE,
        payload: { name, value }
    }
}


class FormDataClass {
    constructor(formDataInput, fieldsForm) {
        fieldsForm.forEach(field => {
            this[field] = formDataInput[field] ?? '';
            if ((typeof this[field] === 'string') && this[field].length) {
                this[field] = this[field].trim();
            }
        });

    }
}



export const sendOrder = (formDataInput, qorder = false) => async (dispatch, getState) => { //, dispatch, getState
    const { requestFormLoader } = useHttp(dispatch);
    const { cart, delivery } = getState();
    const errMsg = "Ошибка связи с сервером, повторите попытку позже";
    const fieldsForm = ['name', 'phone', 'street', 'house', 'flat', 'comment'];

    try {
        const formData = new FormDataClass(formDataInput, fieldsForm);
        formData.cart = cart.cartData;
        formData.discontcupon = cart.cuponData.discontcupon;
        formData.cupon = cart.cuponData.cuponId;
        formData.cityObj = delivery.city;

        formData.deliveryPrice = null;
        formData.pvzSelectStatus = false;
        formData.pvzSelect = null;
        formData.deliverySelect = 0;
        if (delivery.status) {
            formData.deliveryPrice = {
                courier: delivery.courier,
                pvz: delivery.pvz,
            }
            formData.deliverySelect = delivery.deliverySelect;
            if (delivery.pvzSelect) {
                formData.pvzSelect = (delivery.pvzSelect.cityid === delivery.city.id) ? delivery.pvzSelect : null;
                formData.pvzSelectStatus = true;
            }
        }
        const order = await requestFormLoader('/api/order/sentorder', 'post', null, formData);

        const rezult = {
            orderDone: true,
            orderId: order.orderId,
            orderNumber: order.order,
        }

        batch(() => {
            dispatch(setOrder(rezult));
            if (qorder) {
                dispatch(hideDialog());
            }
            dispatch(cartUpdate([]));
        });

        history.push('/order/done');

    } catch (e) {
        dispatch(showAlert(errMsg, 'error'));
        console.error(e)
    }
}


export const sendReturnProduct = (formDataInput) => async (dispatch) => { //, dispatch, getState
    const { requestFormLoader } = useHttp(dispatch);

    const errMsg = "Ошибка связи с сервером, повторите попытку позже";
    const fieldsForm = ['action', 'phone', 'recaptchaToken'];


    try {
        const formData = new FormDataClass(formDataInput, fieldsForm);
        await requestFormLoader('/api/order/returnproductform', 'post', null, formData);

        const rezult = {
            returnProductStatus: true,
            returnProductAction: formData.action ? 'Возврат' : 'Обмен',
        }
        dispatch(setOrder(rezult));

    } catch (e) {
        dispatch(showAlert(errMsg, 'error'));
        console.error(e)
    }
}


export const sendReturnCall = (formDataInput) => async (dispatch) => { //, dispatch, getState
    const { requestFormLoader } = useHttp(dispatch);

    const errMsg = "Ошибка связи с сервером, повторите попытку позже";
    const fieldsForm = ['name', 'phone', 'comment', 'recaptchaToken'];


    try {
        const formData = new FormDataClass(formDataInput, fieldsForm);
        await requestFormLoader('/api/order/returncallform', 'post', null, formData);

        const rezult = {
            returnCallStatus: true,
        }
        dispatch(setOrder(rezult));

    } catch (e) {
        dispatch(showAlert(errMsg, 'error'));
        console.error(e)
    }
}


export const sendComment = (formDataInput) => async (dispatch) => { //, dispatch, getState
    const { requestFormLoader } = useHttp(dispatch);

    const errMsg = "Ошибка связи с сервером, повторите попытку позже";
    const fieldsForm = ['name', 'comment', 'recaptchaToken'];


    try {
        const formDataStart = new FormDataClass(formDataInput, fieldsForm);

        const formData = {
            authorName: formDataStart.name,
            commenText: formDataStart.comment,
           // recaptchaToken: token
          };

        await requestFormLoader('/api/comment/addcomment', 'post', null, formData);

        const rezult = {
            commentStatus: true,
        }
        dispatch(setOrder(rezult));

    } catch (e) {
        dispatch(showAlert(errMsg, 'error'));
        console.error(e)
    }
}