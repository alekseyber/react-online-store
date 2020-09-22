import { SET_DIALOG, OPEN_DIALOG, SET_LOADING_DIALOG, HIDE_DIALOG, SET_SIZECHART, SET_SIZECHART_SELECT, SET_DIALOG_TITLE, SET_OFERTA } from '../constants';

const initialState = {
    loading: false,
    modalRootData: {
        open: false,
        plagin: 0,
        fullWidth: false,
        maxWidth: false,
        scroll: "paper", //body        
    },
    sizechart: {},
    sizechartSelect: null,
    title: "",
    modalPrevData: null,
    ofertaContent: null
}


const handlers = {
    [SET_DIALOG]: (state, { payload }) => ({ ...state, modalRootData: { ...state.modalRootData, ...payload } }),
    [OPEN_DIALOG]: (state, { payload }) => ({ ...state, modalPrevData: state.modalRootData.open ? state.modalRootData : null, modalRootData: { ...state.modalRootData, ...payload } }),
    [SET_LOADING_DIALOG]: (state, { payload }) => ({ ...state, loading: payload }),
    [HIDE_DIALOG]: state => ({ ...state, modalRootData: state.modalPrevData ? state.modalPrevData : { ...state.modalRootData, open: false }, modalPrevData: null }),
    [SET_SIZECHART]: (state, { payload }) => ({ ...state, sizechart: { ...state.sizechart, [payload.sizesgroup_id]: payload.content } }),
    [SET_SIZECHART_SELECT]: (state, { payload }) => ({ ...state, sizechartSelect: payload }),
    [SET_DIALOG_TITLE]: (state, { payload }) => ({ ...state, title: payload }),
    [SET_OFERTA]: (state, { payload }) => ({ ...state, ofertaContent: payload }),

    DEFAULT: state => state
}


export const modaldialogReducer = (state = initialState, action) => {
    const handler = handlers[action.type] || handlers.DEFAULT
    return handler(state, action)
}