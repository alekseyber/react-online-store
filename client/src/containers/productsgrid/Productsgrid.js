import React from "react";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import ProductItem from "../productitem/ProductItem";
import { PaginationList, usePagin } from "../../hoc/Paginationlist";
import {
  PRODUCTS_GRID_QUERY,
  LIST_PRODUCT_QUERY,
} from "../../graphql/gqlQuery";
import { useQueryApp } from "../../hooks/appolloQueryApp.hook";
import LoaderPage from "../../components/loaderpage/LoaderPage";

const ListProduct = ({
  productImgProperty,
  qualityproductImg,
  currSymbol,
  baseUrl,
}) => {
  const paginationRezult = usePagin();

  const ids = paginationRezult.map((el) => {
    if (el.alias) {
      return el.alias;
    }
    return el;
  });

  const { data, loading } = useQueryApp(LIST_PRODUCT_QUERY, { ids });
  if (loading) {
    return <LoaderPage />;
  }

  if (!data) {
    return null;
  }

  return (
    <>
      {paginationRezult.map((item, index) => (
        <ProductItem
          item={item}
          //   alias={item.alias}
          //   colorselect={item.colorselect}
          imgproperty={productImgProperty}
          baseurl={baseUrl}
          quality={qualityproductImg}
          //  colors={colorsData.colors}
          //  bagdes={bagdesData}
          currsymbol={currSymbol}
          key={index}
        />
      ))}
    </>
  );
};

const ProductsGrid = ({ products, page }) => {
  const { baseUrl } = useSelector((state) => state.start); //colorsData, bagdesData,

  const { data, loading } = useQueryApp(PRODUCTS_GRID_QUERY);

  if (loading) {
    return <LoaderPage />;
  }

  if (!data) {
    return null;
  }

  const {
    productImgProperty,
    qualityproductImg,
    currSymbol,
    count_page_product,
  } = data.paramsData;

  const paginBind = {
    countPage: count_page_product,
    page,
    inputList: products,
    spacingGrid: 2,
  };

  const listBind = {
    productImgProperty,
    qualityproductImg,
    currSymbol,
    baseUrl,
  };

  return (
    <PaginationList {...paginBind}>
      <ListProduct {...listBind} />
    </PaginationList>
  );
};

ProductsGrid.defaultProps = {
  products: [],
  page: 1,
};

ListProduct.propTypes = {
  productImgProperty: PropTypes.array.isRequired,
  qualityproductImg: PropTypes.number.isRequired,
  currSymbol: PropTypes.string.isRequired,
  baseUrl: PropTypes.string.isRequired,
};

ProductsGrid.propTypes = {
  products: PropTypes.array,
  page: PropTypes.number,
};

export default ProductsGrid;
