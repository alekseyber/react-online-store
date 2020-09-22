import { SET_PAGE } from '../constants';

const initialState = {
    pageContent: {},    
}


const handlers = {
    [SET_PAGE]: (state, { payload }) => ({ ...state, pageContent: { ...state.pageContent, [payload.alias]: payload.content } }),    

    DEFAULT: state => state
}

export const pageReducer = (state = initialState, action) => {
    const handler = handlers[action.type] || handlers.DEFAULT
    return handler(state, action)
}