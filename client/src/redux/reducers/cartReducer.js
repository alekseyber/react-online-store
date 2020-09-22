import { reactLocalStorage } from 'reactjs-localstorage';
import { CART_ADD, CART_UPDATE, CART_ADD_COUNT, CART_SET_CUPON, CART_CLEAR_CUPON } from '../constants';

const initialCuponData = {
    cupon: '',
    discontcupon: 1,
    cuponId: '',
}


const initialState = {
    cartData: reactLocalStorage.getObject('cartData', [], true),
    lastCart: {
        gender: '',
        title: '',
        imgThumb: '',
        old_price: 0,
        price: 0,
        color: null,
        size: null,
        currSymbol: ''
    },
    countAdd: 0,
    cuponData: reactLocalStorage.getObject('cuponData', initialCuponData, true)
}


const handlers = {
   // [CART_DELETE_ITEM]: (state, { payload }) => ({ ...state, cartData: state.cartData.filter((_, i) => i !== payload) }),
    [CART_ADD]: (state, { payload }) => ({ ...state, countAdd: (state.countAdd + 1), lastCart: payload.lastCart, cartData: [...state.cartData, payload.item] }),
    [CART_UPDATE]: (state, { payload }) => ({ ...state, cartData: payload }),
   // [CART_EDIT_ITEM]: (state, { payload }) => ({ ...state, cartData: state.cartData.splice(payload.index, 1, payload.item) }),
    //[CART_CHANGE_ITEM_COUNT]: (state, { payload }) => ({ ...state, cartData: state.cartData.splice(payload.index, 1, { ...state.cartData[payload.index], qty: payload.qty }) }), //, summ: payload.qty * state.cartData[payload.index].price
    // [CART_ADD_COUNT]: (state, { payload }) => ({ ...state, countAdd: (state.countAdd + 1), lastCart: payload.lastCart, cartData: state.cartData.splice(payload.index, 1, { test: true }) }), // ...state.cartData[payload.index], qty: (state.cartData[payload.index].qty + 1)
    [CART_ADD_COUNT]: (state, { payload }) => ({ ...state, countAdd: (state.countAdd + 1), lastCart: payload.lastCart, cartData: payload.cartData }), // ...state.cartData[payload.index], qty: (state.cartData[payload.index].qty + 1)  
    [CART_SET_CUPON]: (state, { payload }) => ({ ...state, cuponData: payload }),
    [CART_CLEAR_CUPON]: (state) => ({ ...state, cuponData: initialCuponData }),

    DEFAULT: state => state
}


export const cartReducer = (state = initialState, action) => {
    const handler = handlers[action.type] || handlers.DEFAULT
    return handler(state, action)
}