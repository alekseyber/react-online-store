import { batch } from "react-redux";
import { SET_START, SET_APP_SORT } from "../constants";
import { httpActions } from "./../../hooks/http.hook";
// import { updateProducts } from "./products";
// import { cartUpdate } from "./cart";
import { setDelivery } from "./delivery";
//import { setErrorApp } from "./app";

export const getEndTime = (state, key) => {
  const cacheTimeObj = state.start.paramsData.cacheTime ?? null;
  const cacheTime = cacheTimeObj[key] ?? 3600;
  const endTime = Date.now() + cacheTime * 1000;
  return endTime;
};

export const checkEndTime = (item) => {
  let rezult = false;
  const timeStamp = Date.now();

  if (item) {
    if ("endTime" in item) {
      rezult = item.endTime > 0 && item.endTime > timeStamp;
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

// export const checkCart = (cartData, products, dispatch, nulled = true) => {
//   if (cartData.length === 0 && !nulled) {
//     return true;
//   }
//   const newCartData = cartData.filter((el) => {
//     if (el.alias in products) {
//       if (el.level1 in products[el.alias].level1) {
//         return (
//           products[el.alias].level1[el.level1].level2.findIndex(
//             (item) => el.level2 === item
//           ) > -1
//         );
//       }
//     }
//     return false;
//   });

//   dispatch(cartUpdate(newCartData));
// };

// const updateStartCart = async (cart, dispatch) => {
//   const cartData = cart.cartData;

//   if (cartData.length) {
//     const products = [];
//     const tempObj = {};
//     cartData.forEach((element) => {
//       if (element.alias) {
//         if (!tempObj[element.alias]) {
//           tempObj[element.alias] = 1;
//           products.push({
//             alias: element.alias,
//           });
//         }
//       }
//     });
//     if (products.length) {
//       dispatch(updateProducts(products, true));
//       // checkCart(cartData, rezult, dispatch);
//     } else {
//       dispatch(cartUpdate([]));
//     }
//   }
// };

const fetchStart = async (dispatch) => {
  try {
    const { requestNoLoader } = httpActions(dispatch);
    const startData = await requestNoLoader("/api/start/getstart");
    const cacheTime = startData.paramsData.cacheTime.start ?? 36000;
    startData.endTime = Date.now() + cacheTime * 1000;
    batch(() => {
      dispatch(setStartData(startData));
      dispatch(setDelivery(startData.deliveryData));
    });
  } catch (e) {
    throw e;
  }
};

export const updateStart = () => (dispatch, getState) => {
  try {
    const { start } = getState();

    if (checkEndTime(start)) {
      return null;
    }
    fetchStart(dispatch);
  } catch (e) {
    console.error(e);
  }
};

export const setStart = () => async (dispatch) => { //, getState
  try {
    await fetchStart(dispatch);
    // const { cart } = getState();
    // updateStartCart(cart, dispatch);
  } catch (e) {
   // dispatch(setErrorApp(e, setStart));
     console.error(e);
  }
};

// export const textReturnProductFetch = () => async (dispatch, getState) => {
//   try {
//     const { start } = getState();

//     if (start.textReturnProduct) {
//       return null;
//     }

//     const { requestNoLoader } = httpActions(dispatch);

//     const { content } = await requestNoLoader("/api/start/textreturnproduct");
//     const textReturnProduct = content;
//     dispatch(setStartData({ textReturnProduct }));
//   } catch (e) {}
// };
