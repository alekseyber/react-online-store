import { useMemo } from "react"; //React, useEffect, useState,
import { useSelector } from "react-redux";
import PropTypes from "prop-types";

// фильтр товаров
const useFilterProduct = ({ colors, filter, level2, products, filterData }) => {
  const { filterRezult, colorsGrupp, filterIndex, colorsChToGr } = filterData;

  const filterSelect = useSelector((state) => state.filter.filterSelect);

  const {
    productsFilter,
    colorsFilter,
    filterFilter,
    level2Filter,
  } = useMemo(() => {
    const rezult = {
      productsFilter: products,
      colorsFilter: colors,
      filterFilter: filter,
      level2Filter: level2,
    };

    if (Object.keys(filterSelect).length && products.length) {
      rezult.colorsFilter = {};
      rezult.filterFilter = {};
      rezult.level2Filter = {};

      let selectColors = [];
      if (filterSelect.color) {
        Object.keys(filterSelect.color).forEach((el) => {
          selectColors = selectColors.concat(colorsGrupp[el]);
        });
      }

      const isFilter = (value) => {
        const obj = {};
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
        const productListColors = [];

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
    const rezultFilter = [];
    let selectedFilter = false;

    let attrs = {};
    attrs = Object.assign(attrs, filterFilter);
    attrs = Object.assign(attrs, level2Filter);

    const colors = Object.keys(colorsFilter);
    if (colors.length) {
      const grColors = {};
      colors.forEach((color) => {
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

    Object.keys(attrs).forEach((key) => {
      if (key in filterIndex[1]) {
        const itemIndex = filterIndex[1][key];
        const indexGr = itemIndex[0];
        const indexAttr = itemIndex[1];

        if (!rezultFilter[indexGr]) {
          const { alias, color, radio, sizes, title } = filterRezult[indexGr];
          const grupp = {
            alias,
            color,
            radio,
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

    const filter = rezultFilter.map((item) => {
      item.attrs = item.attrs.filter(() => true);
      return item;
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

useFilterProduct.propTypes = {
  colors: PropTypes.object.isRequired,
  filter: PropTypes.object.isRequired,
  level2: PropTypes.object.isRequired,
  products: PropTypes.array.isRequired,
  filterData: PropTypes.object.isRequired,
};

export { useFilterProduct };
