import React from "react";
//import PropTypes from "prop-types";
import ProductItem from "../productitem/ProductItem";
import {
  PaginationList,
  usePagin,
  IPaginContextItem,
} from "../../hoc/Paginationlist";
import {
  PRODUCTS_GRID_QUERY,
  LIST_PRODUCT_QUERY,
  ICategoryProduct,
  ICategoryProductApplyFilter,
  IProducts,
  IProductsVar,
  IProductsGrid,
  ProductBaseForGrid,
  TSearchFullProduct,
} from "../../graphql/gqlQuery";
import { useQueryApp } from "../../hooks/appolloQueryApp.hook";
import LoaderPage from "../../components/loaderpage/LoaderPage";

// ListProduct.propTypes = {
//   productImgProperty: TProductImgProperty[],
//   qualityproductImg: PropTypes.number.isRequired,
//   currSymbol: PropTypes.string.isRequired,
// };

type TProductItemProps =
  | ICategoryProduct
  | ICategoryProductApplyFilter
  | string
  | TSearchFullProduct;

interface ProductsGridProps {
  products: TProductItemProps[];
  page?: number;
}

const ListProduct: React.FC<ProductBaseForGrid> = ({
  productImgProperty,
  qualityproductImg,
  currSymbol,
}) => {
  const paginationRezult = usePagin();

  const ids = paginationRezult.map((el) => {
    if ((el as IPaginContextItem).alias) {
      return (el as IPaginContextItem).alias;
    }
    return el as string;
  });

  const { data, loading } = useQueryApp<IProducts, IProductsVar>(
    LIST_PRODUCT_QUERY,
    { ids }
  );
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
          item={(item as IPaginContextItem | string)}
          imgproperty={productImgProperty}
          quality={qualityproductImg}
          currsymbol={currSymbol}
          key={index}
        />
      ))}
    </>
  );
};

const ProductsGrid: React.FC<ProductsGridProps> = ({ products, page = 1 }) => {
  const { data, loading } = useQueryApp<IProductsGrid>(PRODUCTS_GRID_QUERY);
  
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

// ProductsGrid.defaultProps = {
//   products: [],
//   page: 1,
// };

// ListProduct.propTypes = {
//   productImgProperty: PropTypes.array.isRequired,
//   qualityproductImg: PropTypes.number.isRequired,
//   currSymbol: PropTypes.string.isRequired,
// };

// ProductsGrid.propTypes = {
//   products: PropTypes.array,
//   page: PropTypes.number,
// };

export default ProductsGrid;
