import { SET_DIALOG, OPEN_DIALOG, SET_LOADING_DIALOG, HIDE_DIALOG, SET_SIZECHART, SET_SIZECHART_SELECT, SET_DIALOG_TITLE, SET_OFERTA } from '../constants';
import { useHttp } from './../../hooks/http.hook';
import { showAlert } from './app';

// modalRootData: {
//     open: false,
//     plagin: 0,
//     fullWidth: false,
//     maxWidth: false,
//     scroll: "paper", //body
// },



class ModalDataClass {
    constructor(plagin = 0, maxWidth = 'md', fullWidth = false, scroll = 'paper') {
        this.open = true;
        this.plagin = plagin;
        this.fullWidth = fullWidth;
        this.maxWidth = maxWidth;
        this.scroll = scroll;

    }
}



// maxWidth	'lg'
// | 'md' 
// | 'sm' default
// | 'xl'
// | 'xs'
// | false	


export const setDialog = (payload) => {
    return {
        type: SET_DIALOG,
        payload
    }
}

const openDialog = (payload) => {
    return {
        type: OPEN_DIALOG,
        payload
    }
}

export const hideDialog = () => {
    return {
        type: HIDE_DIALOG
    }
}


export const setLoadingDialog = (payload = false) => {
    return {
        type: SET_LOADING_DIALOG,
        payload
    }
}

const setSizeChart = (payload) => {
    return {
        type: SET_SIZECHART,
        payload
    }
}

const setOferta = (payload) => {
    return {
        type: SET_OFERTA,
        payload
    }
}

const setSizeChartSelect = (payload) => {
    return {
        type: SET_SIZECHART_SELECT,
        payload
    }
}


export const setTitleDialog = (payload) => {
    return {
        type: SET_DIALOG_TITLE,
        payload
    }
}

export const openAddedCart = () => {

    const payload = new ModalDataClass(1, false);

    return {
        type: OPEN_DIALOG,
        payload
    }
}

export const openQOrder = () => {

    const payload = new ModalDataClass(4);

    return {
        type: OPEN_DIALOG,
        payload
    }
}

export const openDelivery = () => {

    const payload = new ModalDataClass(2, 'xl');

    return {
        type: OPEN_DIALOG,
        payload
    }
}

export const openPvzSelector = () => {

    const payload = new ModalDataClass(3, 'xl');

    return {
        type: OPEN_DIALOG,
        payload
    }
}

export const openSizeChart = (sizesgroup_id) => async (dispatch, getState) => {
    try {
        const { request } = useHttp(dispatch);
        const { modaldialog } = getState();
        dispatch(setSizeChartSelect(sizesgroup_id));

        if (!modaldialog.sizechart[sizesgroup_id]) {
            const { content } = await request('/api/modification/getsizeschartcontent', 'get', { sizesgroup_id });

            if (!content) {
                dispatch(showAlert('Данные с сервера не получены, повторите попытку позже', 'error'));
                return false
            }

            dispatch(setSizeChart({
                sizesgroup_id, content
            }));

        }
        
        const modalDialogData = new ModalDataClass();
        dispatch(openDialog(modalDialogData));

    } catch (e) {
        console.error(e)
    }
}


export const openOferta = () => async (dispatch, getState) => {
    try {
        const { request } = useHttp(dispatch);
        const { modaldialog } = getState();
        

        if (!modaldialog.ofertaContent) {
            const { content } = await request('/api/page/getofertacontent');

            if (!content) {
                dispatch(showAlert('Данные с сервера не получены, повторите попытку позже', 'error'));
                return false
            }

            dispatch(setOferta(content));

        }
        const modalDialogData = new ModalDataClass(5, 'xl');
        dispatch(openDialog(modalDialogData));

    } catch (e) {
        console.error(e)
    }
}


export const openReturnCall = () => {

    const payload = new ModalDataClass(6);

    return {
        type: OPEN_DIALOG,
        payload
    }
}
