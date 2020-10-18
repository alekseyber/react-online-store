import React from "react";
import PropTypes from "prop-types";
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
          imgproperty={productImgProperty}          
          quality={qualityproductImg}
          currsymbol={currSymbol}
          key={index}
        />
      ))}
    </>
  );
};

const ProductsGrid = ({ products, page }) => {  
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
};

ProductsGrid.propTypes = {
  products: PropTypes.array,
  page: PropTypes.number,
};

export default ProductsGrid;
