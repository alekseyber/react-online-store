import { SET_MAIN } from "../constants";

const initialState = {
  endTime: 0,
  topSlider: null,
  topslidervisible: false,
  hitvisible: false,
  hitcount: 0,
  hittitle: "",
  maincatalog: [],
  maincatalogvisible: false,
  maincatalogprefix: "",
  maincatalogcount: 0,
  title: "",
  promo: "",
  content: "",
  meta: {
    title: "",
    description: "",
    keywords: "",
  },
  mainBanner: {
    visible: false,
    title: "",
    description: "",
    btnText: "",
    btnLink: "",
    imgBacgr: "",
  },
  hitData: [],
};

const handlers = {
  [SET_MAIN]: (state, { payload }) => ({ ...state, ...payload }),
  DEFAULT: (state) => state,
};

export const mainReducer = (state = initialState, action) => {
  const handler = handlers[action.type] || handlers.DEFAULT;
  return handler(state, action);
};
