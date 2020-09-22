import { SET_ORDER_VALUE, SET_ORDER } from '../constants';


const initialState = {
    // name: "",
    // phone: "",
    // street: "",
    // house: "", //Дом, корпус, строение
    // flat: "", //Квартира/Офис
    // comment: "",
    orderDone:true,
    orderId:"5f5e3aa5457353136c07508a",
    orderNumber:"59-289",
    // orderDone: false,
    // orderId: '',
    // orderNumber: '',
    returnProductStatus: false,
    returnProductAction: '',
    returnCallStatus: false,
    commentStatus: false,
}

const handlers = {
    [SET_ORDER]: (state, { payload }) => ({ ...state, ...payload }),
    [SET_ORDER_VALUE]: (state, { payload }) => ({ ...state, [payload.name]: payload.value }),

    DEFAULT: state => state
}

export const orderReducer = (state = initialState, action) => {
    const handler = handlers[action.type] || handlers.DEFAULT
    return handler(state, action)
}