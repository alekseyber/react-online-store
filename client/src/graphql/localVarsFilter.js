import { makeVar } from "@apollo/client";

export const filterSelectVar = makeVar({});

export const removeFilterSelect = () => {
  filterSelectVar({});
};

const deletObjProperty = (obj, prop) => {
  return Object.keys(obj).reduce((object, key) => {
    if (key !== prop) {
      object[key] = obj[key];
    }
    return object;
  }, {});
};

export const setFilterSelect = (aliasGr, aliasAttr) => {
  
  const filter = filterSelectVar();
  let filterSelect = Object.assign({}, filter);

  if (aliasGr in filterSelect) {
    if (aliasAttr in filterSelect[aliasGr]) {
      filterSelect[aliasGr] = deletObjProperty(
        filterSelect[aliasGr],
        aliasAttr
      );

      if (Object.keys(filterSelect[aliasGr]).length === 0) {
        delete filterSelect[aliasGr];
      }
    } else {
      filterSelect[aliasGr] = {
        ...filterSelect[aliasGr],
        [aliasAttr]: aliasAttr,
      };
    }
  } else {
    filterSelect[aliasGr] = {};
    filterSelect[aliasGr][aliasAttr] = aliasAttr;
  }
  filterSelectVar(filterSelect);
};

export const setFilterSelectByQwery = (qwery, filterIndex) => {
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
    filterSelectVar(filterSelect);
  }
};
