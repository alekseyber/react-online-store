import { SET_SELECT_FILTER, REMOVE_SELECT_FILTER } from "../constants";

export const removeFilterSelect = () => {
  return {
    type: REMOVE_SELECT_FILTER,
  };
};

const setSelect = (filterSelect) => {
  return {
    type: SET_SELECT_FILTER,
    payload: filterSelect,
  };
};

export const setFilterSelect = (aliasGr, aliasAttr) => (dispatch, getState) => {
  const { filter } = getState();
  let filterSelect = Object.assign({}, filter.filterSelect);

  if (aliasGr in filterSelect) {
    if (aliasAttr in filterSelect[aliasGr]) {
      delete filterSelect[aliasGr][aliasAttr];
      if (Object.keys(filterSelect[aliasGr]).length === 0) {
        delete filterSelect[aliasGr];
      }
    } else {
      filterSelect[aliasGr][aliasAttr] = aliasAttr;
    }
  } else {
    filterSelect[aliasGr] = {};
    filterSelect[aliasGr][aliasAttr] = aliasAttr;
  }

  dispatch(setSelect(filterSelect));
};

export const setFilterSelectByQwery = (qwery, filterIndex) => (dispatch) => {
  const keys = Object.keys(qwery);
  const filterSelect = {};

  const addParams = (key, attr) => {
    if (!(key in filterSelect)) {
      filterSelect[key] = {};
    }
    filterSelect[key][attr] = attr;
  };  

  if (keys.length) {
    if (filterIndex) {
      keys.forEach((key) => {
        if (key in filterIndex[0]) {
          qwery[key].forEach((attr) => {
            if (attr in filterIndex[1]) {
              if (filterIndex[1][attr][0] === filterIndex[0][key]) {
                addParams(key, attr);
              }
            }
          });
        }
      });
    }
  }

  if (Object.keys(filterSelect).length) {
    dispatch(setSelect(filterSelect));
  }
};
