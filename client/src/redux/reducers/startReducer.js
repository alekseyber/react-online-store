import { SET_START, SET_APP_SORT } from "../constants";

const initialState = {
  paramsData: {
    phone: {
      href: "",
      title: "",
    },
    select: false,
    shop_name: "",
    shop_name_rus: "",
    shop_fullname_rus: "",
    streetAddress: "",
    shop_email: "",
    count_page_product: 16,
    count_page_comment: 10,
    count_page_news: 12,
    textDeliveryProduct: "",
    bannersDelivery: [],
    topLinks: [],
    bottomLinks: [],
    categoryImgProperty: "",
    logoimg: "",
    productImgProperty: [],
    currSymbol: "",
    defaultDeliveryText: "",
    defaultDeliverySmallText: "",
    defaultDeliveryRegionText: "",
    maxDeliveryHourToday: 16,
    orderDoneText: "",
    qualityproductImg: 3,
    baseUrl: "",
    visisbleTopBanner: false,
    timeCloseTopBanner: 30000,
    cityDefault: {
      id: 44,
      cityName: "Москва",
      oblName: "Москва",
    },
    orderPrintText: "",
    currency: "RUR",
    bannersProduct: [],
    bannersProductOn: false,
    cacheTime: {
      main: 3600,
      product: 3600,
      category: 3600,
      comment: 3600,
      news: 3600,
      page: 3600,
    },
  },
  colorsData: null,
  sizesData: null,
  sortData: { sortList: [], sortValue: undefined },
  brandsData: {},
  bagdesData: {},
  recomaccesData: [],
  categorytreeData: null,
  filterData: null,
  deliveryData: null,
  textReturnProduct: null,
  baseUrl: process.env.NODE_ENV !== "production" ? "http://localhost:5000" : "",
  yaMapKey:
    process.env.REACT_APP_YMAP_KEY || "b43c189e-389a-4ccc-b79e-436d89a914ee",
  googleReKey:
    process.env.REACT_APP_RE_KEY || "6LdMXcQUAAAAAMDZv8aiNoBc1poD0Yd6fZjeivKN",
};

//baseApiUrl
if (process.env.REACT_APP_API_URL) {
  initialState.baseUrl = process.env.REACT_APP_API_URL;
}

const handlers = {
  [SET_START]: (state, { payload }) => ({ ...state, ...payload }),
  [SET_APP_SORT]: (state, { payload }) => ({
    ...state,
    sortData: { ...state.sortData, sortValue: payload },
  }),
  DEFAULT: (state) => state,
};

export const startReducer = (state = initialState, action) => {
  const handler = handlers[action.type] || handlers.DEFAULT;
  return handler(state, action);
};
