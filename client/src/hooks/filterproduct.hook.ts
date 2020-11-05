import { useMemo } from "react"; //React, useEffect, useState,
//import PropTypes from "prop-types";
import {
  SELECT_FILTER_QUERY,
  IFilterSelect,
  ICategoryProductsData,
  ICategoryProduct,
  CategoryPageFilterDataFragment,
  ICategoryProductApplyFilter,
  IFilterGruppBase,
  IFilterGrupp,
  ColorsChToGr,
  FAttrs,
  FColorAttrs,
  FSizesAttrs,
} from "../graphql/gqlQuery";
import { useQueryApp } from "./appolloQueryApp.hook";

declare global {
  interface Array<T> {
    clean(): Array<T>;
  }
}
// eslint-disable-next-line
Array.prototype.clean = function () {
  for (let i = 0; i < this.length; i++) {
    if (!this[i]) {
      this.splice(i, 1);
      i--;
    }
  }
  return this;
};

interface IUseFilterProduct extends ICategoryProductsData {
  products: ICategoryProduct[];
  filterData: CategoryPageFilterDataFragment;
}

interface IL1Attrs {
  [aliasL1: string]: string;
}

interface IFAttrs {
  [aliasAttr: string]: string;
}

interface IL2Attrs {
  [aliasL2: string]: string;
}

export interface IRezultFilter {
  productsFilter: ICategoryProduct[] | ICategoryProductApplyFilter[];
  colorsFilter: IL1Attrs;
  filterFilter: IFAttrs;
  level2Filter: IL2Attrs;
}

interface IFilterGruppCandidat extends IFilterGruppBase {
  attrs: Array<FAttrs | FColorAttrs | FSizesAttrs>;
}

// фильтр товаров
const useFilterProduct = ({
  colors,
  filter,
  level2,
  products,
  filterData,
}: IUseFilterProduct) => {
  const { filterRezult, colorsGrupp, filterIndex, colorsChToGr } = filterData;

  const { data } = useQueryApp<IFilterSelect>(SELECT_FILTER_QUERY);
  // const filterSelect = data ? data.filterSelect : {};

  const filterSelect = useMemo(() => {
    if (data) {
      return data.filterSelect;
    }
    return {};
  }, [data]);

  const {
    productsFilter,
    colorsFilter,
    filterFilter,
    level2Filter,
  }: IRezultFilter = useMemo(() => {
    const rezult: IRezultFilter = {
      productsFilter: products,
      colorsFilter: colors,
      filterFilter: filter,
      level2Filter: level2,
    };

    if (Object.keys(filterSelect).length && products.length) {
      rezult.colorsFilter = {};
      rezult.filterFilter = {};
      rezult.level2Filter = {};

      let selectColors: string[] = [];
      if (filterSelect.color) {
        Object.keys(filterSelect.color).forEach((el) => {
          selectColors = selectColors.concat(colorsGrupp[el]);
        });
      }

      const isFilter = (value: ICategoryProduct) => {
        const obj: { [key: string]: boolean } = {};
        for (const key in filterSelect) {
          obj[key] = false;
          const itemAttrs =
            key === "color" ? selectColors : Object.keys(filterSelect[key]);
          const colorsChek = selectColors;

          itemAttrs.forEach((element) => {
            if (key === "color") {
              if (element in value.level1Filter.level1) {
                obj[key] = true;
              }
            } else if (key === "sizes") {
              if ("color" in filterSelect) {
                colorsChek.forEach((itemcolor) => {
                  if (itemcolor in value.level1Filter.level1) {
                    if (element in value.level1Filter.level1[itemcolor]) {
                      obj[key] = true;
                    }
                  }
                });
              } else {
                if (element in value.level1Filter.level2) {
                  obj[key] = true;
                }
              }
            } else {
              if (element in value.filterFilter) {
                obj[key] = true;
              }
            }
          });
        }

        let rezultItem = true;
        for (const k in obj) {
          rezultItem = rezultItem && obj[k];
          if (rezultItem === false) {
            break;
          }
        }

        if (rezultItem) {
          rezult.colorsFilter = Object.assign(
            rezult.colorsFilter,
            value.level1Filter.level1
          );
          rezult.level2Filter = Object.assign(
            rezult.level2Filter,
            value.level1Filter.level2
          );
          rezult.filterFilter = Object.assign(
            rezult.filterFilter,
            value.filterFilter
          );
        }

        return rezultItem;
      };
      rezult.productsFilter = products.filter(isFilter);

      if (selectColors.length) {
        const productListColors: Array<ICategoryProductApplyFilter> = [];

        rezult.productsFilter.forEach((item) => {
          selectColors.forEach((itemcolor) => {
            if (itemcolor in item.level1Filter.level1) {
              const product = {
                alias: item.alias,
                colorselect: itemcolor,
              };
              productListColors.push(product);
            }
          });
        });

        rezult.productsFilter = productListColors;
      }
    }

    return rezult;
  }, [products, filterSelect, colors, filter, level2, colorsGrupp]);

  const filterNewRezult = useMemo(() => {
    let selectedFilter: boolean = false;

    let attrs: IL1Attrs | IFAttrs | IL2Attrs = {};
    attrs = Object.assign(attrs, filterFilter);
    attrs = Object.assign(attrs, level2Filter);

    const colors = Object.keys(colorsFilter);
    if (colors.length) {
      const grColors: ColorsChToGr = {};
      colors.forEach((color: string) => {
        if (!(colorsChToGr[color] in grColors)) {
          grColors[colorsChToGr[color]] = colorsChToGr[color];
        }
      });
      attrs = Object.assign(attrs, grColors);
    }
    if (Object.keys(filterSelect).length) {
      selectedFilter = true;
      for (const itemGr in filterSelect) {
        attrs = Object.assign(attrs, filterSelect[itemGr]);

        // Object.keys(filterSelect[itemGr]).forEach(itemAttr => {
        //   if (!(itemAttr in attrs)) {
        //     attrs[itemAttr] = itemAttr;
        //   }
        // });
      }
    }

    const rezultFilter: IFilterGruppCandidat[] = [];

    Object.keys(attrs).forEach((key) => {
      if (key in filterIndex[1]) {
        const itemIndex = filterIndex[1][key];
        const indexGr = itemIndex[0];
        const indexAttr = itemIndex[1];

        if (!rezultFilter[indexGr]) {
          const { alias, color, sizes, title } = filterRezult[indexGr];
          const grupp: IFilterGruppCandidat = {
            alias,
            color,
            sizes,
            title,
            attrs: [],
          };
          rezultFilter[indexGr] = grupp;
        }
        const itemAttrRezult = filterRezult[indexGr].attrs[indexAttr];

        // if (itemAttrRezult === undefined) {
        //   console.log('itemAttrRezult', key, itemIndex)
        // }
        if (itemAttrRezult) {
          rezultFilter[indexGr].attrs[indexAttr] = itemAttrRezult;
        }
      }
    });

    const filter: IFilterGrupp[] = rezultFilter.map((item) => {
      item.attrs.clean();

      return item;
      // item.attrs = item.attrs.filter((el) => el);
    });

    return {
      selectedFilter,
      filter,
    };
  }, [
    colorsFilter,
    filterFilter,
    level2Filter,
    filterIndex,
    colorsChToGr,
    filterRezult,
    filterSelect,
  ]);

  const rezult = {
    products: productsFilter,
    filterRezult: filterNewRezult.filter,
    selectedFilter: filterNewRezult.selectedFilter,
  };

  return rezult;
};

// useFilterProduct.propTypes = {
//   colors: PropTypes.object.isRequired,
//   filter: PropTypes.object.isRequired,
//   level2: PropTypes.object.isRequired,
//   products: PropTypes.array.isRequired,
//   filterData: PropTypes.object.isRequired,
// };

export { useFilterProduct };
