import { SET_DELIVERY } from '../constants';
import formatDateStr from '../middleware/format-date-str';


const deliveryDate = formatDateStr();

const initialState = {
    courier: {
        price: '0',
        deliveryPeriodMin: 1,
        deliveryPeriodMax: 1,
        deliveryDateMin: deliveryDate,
        deliveryDateMax: deliveryDate,
        tariffId: 0,
        priceByCurrency: 0,
        currency: 'RUB'
    },
    pvz: {
        price: '0',
        deliveryPeriodMin: 1,
        deliveryPeriodMax: 1,
        deliveryDateMin: deliveryDate,
        deliveryDateMax: deliveryDate,
        tariffId: 0,
        priceByCurrency: 0,
        currency: 'RUB'
    },
    status: true,
    errMsg: '',
    cityid: 44,
    city: {
        id: 44,
        cityName: 'Москва',
        oblName: 'Москва'
    },
    pvzList: null,
    pvzSelect: null,
    deliverySelect: 0
}

const handlers = {
    [SET_DELIVERY]: (state, { payload }) => ({ ...state, ...payload }),

    DEFAULT: state => state
}

export const deliveryReducer = (state = initialState, action) => {
    const handler = handlers[action.type] || handlers.DEFAULT
    return handler(state, action)
}