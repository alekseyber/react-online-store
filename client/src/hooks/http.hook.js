import { useCallback } from "react";
import { useDispatch } from "react-redux";
import fetchData from "./../axios/fetch-data";
import { showAlert, setLoading, setLoadingForm } from "../redux/actions/app";
import { history } from "../redux/store";
import { useRouter } from "./router.hook";

const httpActions = (dispatch, replace = history.replace) => {
  const request = async (
    url,
    method = "get",
    params = null,
    body = null,
    redirect = false,
    errormsg = true,
    loader = true,
    formloading = false
  ) => {
    if (loader) {
      dispatch(setLoading(true));
    }
    if (formloading) {
      dispatch(setLoadingForm(true));
    }
    try {
      const data = await fetchData(url, method, params, body);

      if (loader) {
        dispatch(setLoading(false));
      }
      if (formloading) {
        dispatch(setLoadingForm(false));
      }

      return data;
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
          //  history.replace("/404");
          return replace("/404");
        }
      }

      if (errormsg && !redirect) {
        dispatch(showAlert(e.message, "error"));
      }

      throw e;
    }
  };

  //url, method = 'get', params = null, body = null, redirect = false, errormsg = true, loader = true
  const requestNoErrMsg = (
    url,
    method = "get",
    params = null,
    body = null,
    redirect = false
  ) => request(url, method, params, body, redirect, false, false, false);

  const requestFormLoader = (
    url,
    method = "get",
    params = null,
    body = null,
    redirect = false,
    errormsg = false
  ) => request(url, method, params, body, redirect, errormsg, false, true);

  const requestNoLoader = (
    url,
    method = "get",
    params = null,
    body = null,
    redirect = false,
    errormsg = true
  ) => request(url, method, params, body, redirect, errormsg, false);

  const requestRedirect = (url, params = null, loader = false) =>
    request(url, "get", params, null, true, false, loader);

  return {
    request,
    requestNoLoader,
    requestRedirect,
    requestFormLoader,
    requestNoErrMsg,
  };
};

const useHttp = () => {
  const dispatch = useDispatch();
  const { replace } = useRouter();
  const fetchDataActions = httpActions(dispatch, replace);

  const request = useCallback(fetchDataActions.request, []);
  const requestNoLoader = useCallback(fetchDataActions.requestNoLoader, []);
  const requestRedirect = useCallback(fetchDataActions.requestRedirect, []);
  const requestFormLoader = useCallback(fetchDataActions.requestFormLoader, []);
  const requestNoErrMsg = useCallback(fetchDataActions.requestNoErrMsg, []);


  return {
    request,
    requestNoLoader,
    requestRedirect,
    requestFormLoader,
    requestNoErrMsg,
  };
};

export { useHttp, httpActions };
