import { SET_PRODUCTS, SET_MAIN_PRODUCT } from '../constants';

const initialState = {}


const handlers = {
    [SET_PRODUCTS]: (state, { payload }) => ({ ...state, ...payload }),   
    [SET_MAIN_PRODUCT]: (state, { payload }) => ({ ...state, [payload.alias]: { ...state[payload.alias], mainData: payload.mainData } }),
    DEFAULT: state => state
}

export const productsReducer = (state = initialState, action) => {
    const handler = handlers[action.type] || handlers.DEFAULT
    return handler(state, action)
}