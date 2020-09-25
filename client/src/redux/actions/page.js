import { SET_PAGE, SET_NEWS, SET_NEWS_LIST, SET_COMMENT_LIST } from "../constants";
import { httpActions } from "./../../hooks/http.hook";
import { getEndTime, checkEndTime } from "./start";

// const setPageData = (alias, content) => {
//   return {
//     type: SET_PAGE,
//     payload: { alias, content },
//   };
// };

export const pageFetch = (alias) => async (dispatch, getState) => {
  try {
    const { page } = getState();

    if (checkEndTime(page.pageContent[alias])) {
      return null;
    }

    const { requestRedirect } = httpActions(dispatch);

    const content = await requestRedirect(`/api/page/${alias}`);
    content.endTime = getEndTime(getState(), "page");

    //dispatch(setPageData(alias, content))

    dispatch({
      type: SET_PAGE,
      payload: { alias, content },
    });
  } catch (e) {
    //console.error(e);
  }
};

export const newsFetch = (alias) => async (dispatch, getState) => {
  try {
    const { page } = getState();
    
    if (checkEndTime(page.newsContent[alias])) {
        return null;
    }

    const { requestRedirect } = httpActions(dispatch);

    const content = await requestRedirect(`/api/news/${alias}`);
    content.endTime = getEndTime(getState(), "news");

    dispatch({
      type: SET_NEWS,
      payload: { alias, content },
    });
  } catch (e) {
    //console.error(e);
  }
};

export const newsListFetch = () => async (dispatch, getState) => {
  try {
    const { page } = getState();

    if (checkEndTime(page.newsList)) {
        return null;
    }   

    const { requestNoErrMsg } = httpActions(dispatch);

    const list = await requestNoErrMsg("/api/news/getall");
    const endTime = getEndTime(getState(), "news");

    dispatch({
      type: SET_NEWS_LIST,
      list: { endTime, list },
    });
  } catch (e) {
   // console.error(e);
  }
};

export const commentListFetch = () => async (dispatch, getState) => {
    try {
      const { page } = getState();
  
      if (checkEndTime(page.commentList)) {
          return null;
      }   
  
      const { requestNoErrMsg } = httpActions(dispatch);
  
      const list = await requestNoErrMsg("/api/comment/getall");
      const endTime = getEndTime(getState(), "comment");
  
      dispatch({
        type: SET_COMMENT_LIST,
        list: { endTime, list },
      });
    } catch (e) {
     console.error(e);
    }
  };
