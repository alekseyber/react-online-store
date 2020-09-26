import { batch } from "react-redux";
import { SET_CATEGORY, SET_SORT } from "../constants";
import { httpActions } from "./../../hooks/http.hook";
import { updateProducts } from "./products";
import { getEndTime, checkEndTime } from "./start";

const setCategoryData = (payload) => {
  return {
    type: SET_CATEGORY,
    payload,
  };
};

const setCategorySortData = (payload) => {
  return {
    type: SET_SORT,
    payload,
  };
};

export const categoryFetch = (alias) => async (dispatch, getState) => {
  try {
    const { category } = getState();

    if (checkEndTime(category[alias])) {
      return null;
    }

    const { start } = getState();
    const { requestRedirect } = httpActions(dispatch);

    const categoryData = await requestRedirect(
      `/api/category/getproductsforcategory/${alias}`,
      { sortValue: start.sortData.sortValue }
    );
    const newcategoryData = {};
    newcategoryData.endTime = getEndTime(getState(), "category");
    newcategoryData.productsData = {};
    newcategoryData.productsData.colors = categoryData.productsData.colors;
    newcategoryData.productsData.countModif =
      categoryData.productsData.countModif;
    newcategoryData.productsData.countProduct =
      categoryData.productsData.countProduct;
    newcategoryData.productsData.filter = categoryData.productsData.filter;
    newcategoryData.productsData.level2 = categoryData.productsData.level2;
    newcategoryData.productsData.maxPrice = categoryData.productsData.maxPrice;
    newcategoryData.productsData.minPrice = categoryData.productsData.minPrice;
    newcategoryData.contData = categoryData.contData;
    newcategoryData.products = categoryData.productsData.products;
    newcategoryData.sortValue = categoryData.productsData.sortValue;

    batch(() => {
      dispatch(updateProducts(categoryData.productsData.products));
      dispatch(setCategoryData({ alias, newcategoryData }));
    });
  } catch (e) {
    //  console.error(e)
  }
};

export const categoryUpdateSort = (alias, sortValue) => (
  dispatch,
  getState
) => {
  const { start, category } = getState();

  if (!category[alias]) {
    return null;
  }

  const sortList = start.sortData.sortList;
  const objSort = sortList.find((e) => e._id === sortValue);

  let products = [...category[alias].products];

  const sortFunction = (a, b) => {
    if (objSort.order === false) {
      if (typeof a[objSort.field] === "string") {
        return a[objSort.field].localeCompare(b[objSort.field]);
      } else {
        return a[objSort.field] - b[objSort.field];
      }
    } else {
      if (typeof a[objSort.field] === "string") {
        b[objSort.field].localeCompare(a[objSort.field]);
      } else {
        return b[objSort.field] - a[objSort.field];
      }
    }
  };

  products.sort(sortFunction);

  dispatch(
    setCategorySortData({
      alias,
      products,
      sortValue,
    })
  );
};
