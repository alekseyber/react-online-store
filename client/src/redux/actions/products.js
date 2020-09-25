import { batch } from "react-redux";
import { SET_PRODUCTS, SET_MAIN_PRODUCT } from "../constants";
import { httpActions } from "./../../hooks/http.hook";

const setProductsData = (payload) => {
  return {
    type: SET_PRODUCTS,
    payload,
  };
};

const setMainProduct = (payload) => {
  return {
    type: SET_MAIN_PRODUCT,
    payload,
  };
};

// export const setColorProduct = (payload) => {

//     return {
//         type: SET_COLOR,
//         payload
//     }
// }

export const updateProducts = (
  products,
  byalias = false,
  returnRez = false
) => async (dispatch, getState) => {
  //, getState
  try {
    if (products.length === 0) {
      return null;
    }

    const state = getState();
    const { requestNoLoader } = httpActions(dispatch);

    const ids = [];
    products.forEach((element) => {
      if (element.alias in state.products === false) {
        if (byalias) {
          ids.push(element.alias);
        } else {
          ids.push(element._id);
        }
      }
    });

    if (ids.length > 0) {
      const params = {
        ids: ids.join(),
      };

      if (byalias) {
        params.byalias = true;
      }

      const productsData = await requestNoLoader(
        "/api/products/getproductsbyids",
        "get",
        params
      );
      dispatch(setProductsData(productsData));
      if (returnRez) {
        const productsReturn = {};
        products.forEach((el) => {
          if (el.alias in productsData) {
            productsReturn[el.alias] = productsData[el.alias];
          } else if (el.alias in state.products) {
            productsReturn[el.alias] = state.products[el.alias];
          }
        });
        return productsReturn;
      }
    }
  } catch (e) {
    console.error(e);
  }
};

export const mainProductFetch = (alias) => async (dispatch, getState) => {
  try {
    const { products } = getState();
    const { requestRedirect } = httpActions(dispatch);

    let mainLoad = true;

    const added = [];

    if (products[alias]) {
      if (products[alias].mainData) {
        mainLoad = false;
      }
    } else {
      added.push({ alias });
    }
    if (mainLoad) {
      const productContentData = await requestRedirect(
        `/api/products/getproductcontent/${alias}`
      );
      if (productContentData.related) {
        added.push({ alias: productContentData.related });
      }
      batch(async () => {
        await dispatch(updateProducts(added, true));
        dispatch(setMainProduct({ alias, mainData: productContentData }));
      });
    }
  } catch (e) {
    console.error(e);
  }
};
