import { makeVar } from "@apollo/client";

import { FilterIndex, IFilterIndexL0, IFilterIndexL1 } from "./gqlQuery";

import { TStringifiableRecordArrayParams } from "../hooks/router.hook";

export interface IFilterSelectAttr {
  [aliasAttr: string]: string;
}

// export interface IQweryFilterProps {
//   [key: string]: string[];
// }

export interface IFilterSelectGr {
  [aliasGr: string]: IFilterSelectAttr;
}

export const filterSelectVar = makeVar<IFilterSelectGr>({});

export const removeFilterSelect = (): void => {
  filterSelectVar({});
};

//

// const deletObjProperty = <T extends object>(
//   inputObj: T,
//   prop: string
// ): T => {
//   const rezult = <T>{};

//   for (const key in inputObj) {
//     if (key !== prop) {
//       rezult[key as keyof T] = inputObj[key as keyof T];
//     }
//   }

//   return rezult;

//   // return Object.keys(inputObj).reduce((object: T, key: string): T => {
//   //   if (key !== prop) {
//   //   //  const keyItem: (keyof T) = key;
//   //     object[key] = inputObj[keyItem];
//   //   }
//   //   return object;
//   // }, <T>{});
// };

const deletObjProperty = <T extends object, R extends keyof T>(
  inputObj: T,
  prop: R
): T => {
  const rezult: T = { ...inputObj };
  delete rezult[prop];

  // for (const key in inputObj) {
  //   if (key !== prop) {
  //     rezult[key as keyof T] = inputObj[key as keyof T];
  //   }
  // }

  return rezult;
};

export const setFilterSelect = (aliasGr: string, aliasAttr: string): void => {
  const filter = filterSelectVar();
  let filterSelect = Object.assign({}, filter);

  if (aliasGr in filterSelect) {
    if (aliasAttr in filterSelect[aliasGr]) {
      filterSelect[aliasGr] = deletObjProperty<IFilterSelectAttr, string>(
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

export const setFilterSelectByQwery = (
  qwery: TStringifiableRecordArrayParams,
  filterIndex: FilterIndex | undefined
) => {
  const keys = Object.keys(qwery);
  const filterSelect: IFilterSelectGr = {};

  const addParams = (key: string, attr: string) => {
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
              if (
                filterIndex[1][attr as keyof IFilterIndexL1][0] ===
                filterIndex[0][key as keyof IFilterIndexL0]
              ) {
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
