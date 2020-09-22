import { batch } from 'react-redux';
import { SET_COLOR, SET_SIZE, SET_COLOR_SIZE } from '../constants';








const setColorProduct = (payload) => {

    return {
        type: SET_COLOR,
        payload
    }
}

export const setSizeProduct = (payload) => {

    return {
        type: SET_SIZE,
        payload
    }
}

export const setColorAndSizeProduct = (alias, level1, level2) => {
    const payload = {
        alias,
        color: null,
        size: null
    }
    if (level1) {
        payload.color = level1;
    }
    if (level2) {
        payload.size = level2;
    }
    return {
        type: SET_COLOR_SIZE,
        payload
    }
}



export const setColorProductAction = ({ alias, color }) => (dispatch, getState) => {

    const { productselect } = getState();

    let resetSize = false;

    const selectSize = productselect.size[alias];

    if (selectSize) {
        const { products } = getState();
        const { level1_data } = products[alias];
        const level1 = level1_data
        if (level1) {
            const level2 = level1.findIndex(el => el.level2_alias === selectSize);

            if (level2 === -1) {
                resetSize = true;
            }
        }
    }


    batch(() => {

        if (resetSize) {
            dispatch(setSizeProduct({
                alias,
                size: null
            }));
        }
        dispatch(setColorProduct({
            alias, color
        }));


    });

}