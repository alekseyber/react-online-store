import { batch } from "react-redux";
import { SET_CATEGORY, SET_SORT } from "../constants";
import { httpActions } from "./../../hooks/http.hook";
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

    categoryData.endTime = getEndTime(getState(), "category");

    batch(() => {      
      dispatch(setCategoryData({ alias, categoryData }));
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
