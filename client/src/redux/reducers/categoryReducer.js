import { SET_CATEGORY, SET_SORT } from '../constants';

const initialState = {}


const handlers = {
    [SET_CATEGORY]: (state, { payload }) => ({ ...state, [payload.alias]: payload.categoryData }),
    [SET_SORT]: (state, { payload }) => ({ ...state, [payload.alias]: { ...state[payload.alias], products: payload.products, sortValue: payload.sortValue } }),

    DEFAULT: state => state
}

export const categoryReducer = (state = initialState, action) => {
    const handler = handlers[action.type] || handlers.DEFAULT
    return handler(state, action)
}