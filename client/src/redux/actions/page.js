import { SET_PAGE } from '../constants';
import { useHttp } from './../../hooks/http.hook';


const setPageData = (alias, content) => {
    return {
        type: SET_PAGE,
        payload: { alias, content }
    }
}

export const pageFetch = (alias) => async (dispatch, getState) => {
    try {

        const { page } = getState();

        if (page[alias]) {
            return null
        }

        const { requestRedirect } = useHttp(dispatch);

        const content = await requestRedirect(
            `/api/page/${alias}`,
        );

        dispatch(setPageData(alias, content));
      
    } catch (e) {}
}


