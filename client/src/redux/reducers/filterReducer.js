import { SET_SELECT_FILTER, REMOVE_SELECT_FILTER } from '../constants';

const initialState = {    
    filterSelect: {},    
}


const handlers = {
    [SET_SELECT_FILTER]: (state, { payload }) => ({ ...state, filterSelect: payload }),    
    [REMOVE_SELECT_FILTER]: state => ({ ...state, filterSelect: {} }),
    DEFAULT: state => state
}

export const filterReducer = (state = initialState, action) => {
    const handler = handlers[action.type] || handlers.DEFAULT
    return handler(state, action)
}