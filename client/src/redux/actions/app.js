import {
  HIDE_ALERT,
  SHOW_ALERT,
  SET_LOADING,
  SET_PAGE_LOADING,
  SET_LOADING_FORM,
  TOGGLE_COLUMN,
  ADD_RECENTLY_VIEWED,
  SET_ERROR_APP,
  SET_CITY_APP,
  SET_START_APP,
  SET_SORT_VALUE_APP,
  SET_PVZ_SELECT_APP,
  SET_DELIVERY_SELECT_APP,
} from "../constants";

export const hideAlert = () => {
  return {
    type: HIDE_ALERT,
  };
};

export const setCity = (city) => {
  return {
    type: SET_CITY_APP,
    payload: city,
  };
};

export const setPVZSelect = (payload) => {
  return {
    type: SET_PVZ_SELECT_APP,
    payload,
  };
};

export const setDeliveryApp = (payload) => {
  return {
    type: SET_DELIVERY_SELECT_APP,
    payload,
  };
};

export const setSortValueApp = (sortValue) => {
  return {
    type: SET_SORT_VALUE_APP,
    payload: sortValue,
  };
};

export const setStartApp = (payload) => {
  return {
    type: SET_START_APP,
    payload,
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

export const setErrorApp = (error, func, dispOn = false) => {
  //  if (e.response.status === 404) {

  let title = "Ой, что-то пошло не так...";
  let text = "Проверьте интернет и попробуйте еще раз...";

  console.log("setErrorApp", error.message);

  // if (error.response) {
  //   if (error.response.status === 503) {
  //     // title = "На сервере проводятся технические работы";
  //     title = error.response.data;
  //     text = "Повторите попытку позже.";
  //   }
  // }

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
