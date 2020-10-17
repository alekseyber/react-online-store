import {
  SET_LOADING,
  SET_LOADING_FORM,
  SET_PAGE_LOADING,
  HIDE_ALERT,
  SHOW_ALERT,
  TOGGLE_COLUMN,
  ADD_RECENTLY_VIEWED,
  SET_ERROR_APP,
  SET_CITY_APP,
  SET_START_APP,
  SET_SORT_VALUE_APP,
  SET_PVZ_SELECT_APP,
  SET_DELIVERY_SELECT_APP
} from "../constants";

const initialState = {
  loading: false,
  loadingForm: false,
  alertType: "success",
  alertText: "",
  alertVisible: false,
  column: true,
  pageloading: false,
  recentlyViewed: [],
  error: null,
  // city: {
  //   id: 44,
  //   cityName: "Москва",
  //   oblName: "Москва",
  // },
 // pvzSelect: null,
  deliverySelect: 0,
 // sortValue: "",
  baseApiUrl:
    process.env.NODE_ENV !== "production" ? "http://localhost:5000" : "",
  yaMapKey:
    process.env.REACT_APP_YMAP_KEY || "b43c189e-389a-4ccc-b79e-436d89a914ee",
  googleReKey:
    process.env.REACT_APP_RE_KEY || "6LdMXcQUAAAAAMDZv8aiNoBc1poD0Yd6fZjeivKN",
};

if (process.env.REACT_APP_API_URL) {
  initialState.baseApiUrl = process.env.REACT_APP_API_URL;
}

const handlers = {
  [SET_LOADING]: (state, { payload }) => ({ ...state, loading: payload }),
  [SET_LOADING_FORM]: (state, { payload }) => ({
    ...state,
    loadingForm: payload,
  }),
  [SET_PAGE_LOADING]: (state, { payload }) => ({
    ...state,
    pageloading: payload,
  }),
  [SHOW_ALERT]: (state, { payload }) => ({
    ...state,
    alertType: payload.type,
    alertText: payload.text,
    alertVisible: true,
  }),
  [HIDE_ALERT]: (state) => ({ ...state, alertVisible: false }),
  [TOGGLE_COLUMN]: (state) => ({ ...state, column: !state.column }),
  [ADD_RECENTLY_VIEWED]: (state, { payload }) => ({
    ...state,
    recentlyViewed: payload,
  }),
  [SET_ERROR_APP]: (state, { payload }) => ({ ...state, error: payload }),
  [SET_CITY_APP]: (state, { payload }) => ({ ...state, city: payload }), //new
  [SET_PVZ_SELECT_APP]: (state, { payload }) => ({ ...state, pvzSelect: payload }), //new
  [SET_DELIVERY_SELECT_APP]: (state, { payload }) => ({ ...state, deliverySelect: payload }), //new
  [SET_SORT_VALUE_APP]: (state, { payload }) => ({
    ...state,
    sortValue: payload,
  }), //new
  [SET_START_APP]: (state, { payload }) => ({ ...state, ...payload }), //new
  DEFAULT: (state) => state,
};

export const appReducer = (state = initialState, action) => {
  const handler = handlers[action.type] || handlers.DEFAULT;
  return handler(state, action);
};
