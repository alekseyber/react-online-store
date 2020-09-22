import { SET_COLOR, SET_SIZE, SET_COLOR_SIZE } from '../constants';

const initialState = {
    color: {},
    size: {}
}


const handlers = {
    [SET_COLOR]: (state, { payload }) => ({ ...state, color: { ...state.color, [payload.alias]: payload.color } }),
    [SET_SIZE]: (state, { payload }) => ({ ...state, size: { ...state.size, [payload.alias]: payload.size } }),
    [SET_COLOR_SIZE]: (state, { payload }) => ({ ...state, color: { ...state.color, [payload.alias]: payload.color }, size: { ...state.size, [payload.alias]: payload.size } }),

    DEFAULT: state => state
}

export const productselectReducer = (state = initialState, action) => {
    const handler = handlers[action.type] || handlers.DEFAULT
    return handler(state, action)
}