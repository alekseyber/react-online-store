//import { useDispatch } from 'react-redux';
import qs from 'qs';
import axios from './../axios/axios-store';
import { showAlert, setLoading, setLoadingForm } from '../redux/actions/app';
import { history } from '../redux/store';
//import { useRouter } from './router.hook';




const useHttp = (dispatch) => {

  // const { replace } = useRouter();
  // const dispatch = useDispatch();

  const request = async (url, method = 'get', params = null, body = null, redirect = false, errormsg = true, loader = true, formloading = false) => {

    if (loader) {
      dispatch(setLoading(true));
    }
    if (formloading) {
      dispatch(setLoadingForm(true));
    }
    try {
      //  axios.defaults.baseURL = (process.env.NODE_ENV === 'development') ? 'http://localhost:5000' : '';

      const config = {
        method,
        url
      }

      if (params) {
        config.params = params;
      }

      if (body) {
        config.data = qs.stringify(body);
      }
      //console.log(config)
      const { data } = await axios(config);


      if (loader) {
        dispatch(setLoading(false));
      }
      if (formloading) {
        dispatch(setLoadingForm(false));
      }

      return data

    } catch (e) {
      if (loader) {
        dispatch(setLoading(false));
      }
      if (formloading) {
        dispatch(setLoadingForm(false));
      }

      if (e.response && redirect) {
        //  console.log("status", e.response.status)
        if (e.response.status === 404) {
          // console.log('404')
          history.replace('/404');
          // replace('/404');
        }
      }

      if (errormsg && !redirect) {
        dispatch(showAlert(e.message, 'error'));
      }

      throw e
    }
  }

  //url, method = 'get', params = null, body = null, redirect = false, errormsg = true, loader = true
  const requestNoErrMsg = (url, method = 'get', params = null, body = null, redirect = false) => request(url, method, params, body, redirect, false, false, false);
  const requestFormLoader = (url, method = 'get', params = null, body = null, redirect = false, errormsg = false) => request(url, method, params, body, redirect, errormsg, false, true);
  const requestNoLoader = (url, method = 'get', params = null, body = null, redirect = false, errormsg = true) => request(url, method, params, body, redirect, errormsg, false);
  const requestRedirect = (url, params = null, loader = false) => request(url, 'get', params, null, true, false, loader);

  return { request, requestNoLoader, requestRedirect, requestFormLoader, requestNoErrMsg }
}


export { useHttp };
