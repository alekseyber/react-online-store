import {
  HIDE_ALERT,
  SHOW_ALERT,
  SET_LOADING,
  SET_PAGE_LOADING,
  SET_LOADING_FORM,
  TOGGLE_COLUMN,
  ADD_RECENTLY_VIEWED,
  SET_ERROR_APP,
} from "../constants";

export const hideAlert = () => {
  return {
    type: HIDE_ALERT,
  };
};

export const showAlert = (text, type = "success") => (dispatch, getState) => {
  dispatch({
    type: SHOW_ALERT,
    payload: { type, text },
  });
  setTimeout(() => {
    const { app } = getState();
    if (app.alertVisible) {
      dispatch(hideAlert());
    }
  }, 2500);
};

export const setLoading = (loading = true) => {
  return {
    type: SET_LOADING,
    payload: loading,
  };
};

export const setLoadingForm = (loading = true) => {
  return {
    type: SET_LOADING_FORM,
    payload: loading,
  };
};

export const setPageLoading = (loading = true) => {
  return {
    type: SET_PAGE_LOADING,
    payload: loading,
  };
};

export const toggleColumn = () => {
  return {
    type: TOGGLE_COLUMN,
  };
};

export const addRecentlyViewed = (alias) => (dispatch, getState) => {
  const { app } = getState();
  if (app.recentlyViewed.indexOf(alias) === -1) {
    const recentlyViewed = [...app.recentlyViewed];
    recentlyViewed.unshift(alias);
    dispatch({
      type: ADD_RECENTLY_VIEWED,
      payload: recentlyViewed,
    });
  }
};

export const setErrorApp = (error, func, dispOn = true) => {
  //  if (e.response.status === 404) {

  let title = "Ой, что-то пошло не так...";
  let text = "Проверьте интернет и попробуйте еще раз...";

  if (error.response) {
    if (error.response.status === 503) {
      // title = "На сервере проводятся технические работы";
      title = error.response.data;
      text = "Повторите попытку позже.";
    }
  }

  const payload = {
    title,
    text,
    func,
    dispOn,
  };

  return {
    type: SET_ERROR_APP,
    payload,
  };
};

export const clearErrorApp = () => {
  return {
    type: SET_ERROR_APP,
    payload: null,
  };
};
