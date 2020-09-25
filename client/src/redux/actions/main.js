import { batch } from 'react-redux';
import { SET_MAIN } from '../constants';
import { httpActions } from './../../hooks/http.hook';
import { updateProducts } from './products';
import { setPageLoading } from './app';


//import { history } from '../store'

const setMainData = (payload) => {
    return {
        type: SET_MAIN,
        payload
    }
}

export const mainFetch = () => async (dispatch, getState) => { //, getState
    try {
       
        const { main } = getState();

        if (main.loadData) {
            return null
        }
        dispatch(setPageLoading(true));

        const { requestNoLoader } = httpActions(dispatch);
        //   , method = 'get', params = null, body = null, redirect = false
        const mainData = await requestNoLoader('/api/mainpage/getdata');
        //  const mainData = await request('/api/mainpage/getdata', 'get', null, null, true);

        mainData.hitData = [];

        const countHits = mainData.hitcount;
        if (countHits) {
            const hitData = await requestNoLoader('/api/products/getproductshit', 'get', { countHits });
            if (hitData.length) {
                mainData.hitData = hitData;
                // dispatch(setHitsData(hitsData));
            }
        }
        batch(() => {
            dispatch(setMainData(mainData));
            dispatch(updateProducts(mainData.hitData));
        })
        dispatch(setPageLoading(false));

    } catch (e) {
        dispatch(setPageLoading(false));
        //  console.error(e)
    }
}









// export const showAlert = (text, type = 'success') => {
//     return {
//       type: SHOW_ALERT,
//       payload: { type, text }
//     });
//     setTimeout(() => {
//       hideAlert();
//     }, 2500)
//   };