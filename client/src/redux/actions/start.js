import { batch } from "react-redux";
import { SET_START, SET_APP_SORT } from "../constants";
import { httpActions } from "./../../hooks/http.hook";
import { updateProducts } from "./products";
import { cartUpdate } from "./cart";
import { setDelivery } from "./delivery";

export const getEndTime = (state, key) => {
  const cacheTimeObj = state.start.paramsData.cacheTime ?? null;
  const cacheTime = cacheTimeObj[key] ?? 3600;
  const endTime = Date.now() + cacheTime;
  return endTime;
};

export const checkEndTime = (item) => {
  let rezult = false;

  if (item) {
    if ("endTime" in item) {
      rezult = item.endTime > 0 && item.endTime < Date.now();
    }
  }

  return rezult;
};

const setStartData = (payload) => {
  return {
    type: SET_START,
    payload,
  };
};

export const setSortValue = (payload) => {
  return {
    type: SET_APP_SORT,
    payload,
  };
};

export const setStart = () => async (dispatch, getState) => {
  //, getState
  try {
    const { cart } = getState();
    const cartData = cart.cartData;
    const { requestNoLoader } = httpActions(dispatch);
    const startData = await requestNoLoader("/api/start/getstart");

    if (cartData.length) {
      const products = [];
      const tempObj = {};
      cartData.forEach((element) => {
        if (element.alias) {
          if (!tempObj[element.alias]) {
            tempObj[element.alias] = 1;
            products.push({
              alias: element.alias,
            });
          }
        }
      });
      if (products.length) {
        const rezult = await dispatch(updateProducts(products, true, true));
        const keys = Object.keys(rezult);

        if (keys.length !== products.length) {
          const newCartData = cartData.filter(
            (el) => keys.findIndex((item) => el.alias === item) > -1
          );
          dispatch(cartUpdate(newCartData));
        }
      } else {
        dispatch(cartUpdate([]));
      }
    }
    batch(() => {
      dispatch(setStartData(startData));

      // const deliveryData = {...startData.deliveryData}
      // deliveryData.city.id = 224;
      dispatch(setDelivery(startData.deliveryData));
    });
  } catch (e) {
    console.error(e);
  }
};

export const textReturnProductFetch = () => async (dispatch, getState) => {
  try {
    const { start } = getState();

    if (start.textReturnProduct) {
      return null;
    }

    const { requestNoLoader } = httpActions(dispatch);

    const textReturnProduct = await requestNoLoader(
      "/api/params/textreturnproduct"
    );

    dispatch(setStartData({ textReturnProduct }));
  } catch (e) {}
};
