import { batch } from "react-redux";
import { SET_MAIN } from "../constants";
import { httpActions } from "./../../hooks/http.hook";
import { updateProducts } from "./products";
import { setPageLoading } from "./app";
import { getEndTime, checkEndTime } from "./start";


const setMainData = (payload) => {
  return {
    type: SET_MAIN,
    payload,
  };
};

export const mainFetch = () => async (dispatch, getState) => {
  
  try {
    const { main } = getState();

    if (checkEndTime(main)) {
      return null;
    }

    dispatch(setPageLoading(true));
    const { requestNoLoader } = httpActions(dispatch);
    const mainData = await requestNoLoader("/api/mainpage/getdata");
    mainData.endTime = getEndTime(getState(), "main");

    mainData.hitData = [];

    const countHits = mainData.hitcount;
    if (countHits) {
      const hitData = await requestNoLoader(
        "/api/products/getproductshit",
        "get",
        { countHits }
      );
      if (hitData.length) {
        mainData.hitData = hitData;
      }
    }
    batch(() => {
      dispatch(setMainData(mainData));
      dispatch(updateProducts(mainData.hitData));
    });
  } catch (e) {
    //  console.error(e)
  } finally {
    dispatch(setPageLoading(false));
  }
};