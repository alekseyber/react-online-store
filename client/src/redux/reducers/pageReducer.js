import {
  SET_PAGE,
  SET_NEWS,
  SET_NEWS_LIST,
  SET_COMMENT_LIST,
  SET_COMMENT,
} from "../constants";

const initialState = {
  pageContent: {},
  newsContent: {},
  newsList: {
    endTime: 0,
    list: [],
  },
  commentList: {
    endTime: 0,
    list: [],
  },
};

const handlers = {
  [SET_PAGE]: (state, { payload }) => ({
    ...state,
    pageContent: { ...state.pageContent, [payload.alias]: payload.content },
  }),
  [SET_NEWS]: (state, { payload }) => ({
    ...state,
    newsContent: { ...state.newsContent, [payload.alias]: payload.content },
  }),
  [SET_NEWS_LIST]: (state, { list }) => ({ ...state, newsList: list }),
  [SET_COMMENT_LIST]: (state, { list }) => ({ ...state, commentList: list }),
  [SET_COMMENT]: (state, { item }) => ({
    ...state,
    commentList: {
      ...state.commentList,
      list: [item, ...state.commentList.list],
    },
  }),

  DEFAULT: (state) => state,
};

export const pageReducer = (state = initialState, action) => {
  const handler = handlers[action.type] || handlers.DEFAULT;
  return handler(state, action);
};
