import { FC } from "react";
import Grid from "@material-ui/core/Grid";
import { useProductDataRender } from "../../hooks/useProductDataRender.hook";
import ProductImgCarusel from "../../components/productimgcarusel/ProductImgCarusel";
import ProductForMain from "../../components/productformain/ProductForMain";
import {
  SELECT_COLOR_QUERY,
  ProductFragment,
  ProductMainPageProductFragment,
  TProductImgProperty,
  ISelectColor,
  ISelectColorVar,
} from "../../graphql/gqlQuery";
import { useQueryApp } from "../../hooks/appolloQueryApp.hook";

interface IProductData {
  product: ProductFragment;
  productMain: ProductMainPageProductFragment;
}

interface ProductMainCardProps extends IProductData {
  imgproperty: TProductImgProperty[];
  baseurl: string;
  qualityproductImg: number;
  currsymbol: string;
}

const ProductMainCard: FC<ProductMainCardProps> = ({
  product,
  productMain,
  imgproperty,
  baseurl,
  qualityproductImg,
  currsymbol,
}) => {
  const alias = product.alias;
  const { data } = useQueryApp<ISelectColor, ISelectColorVar>(
    SELECT_COLOR_QUERY,
    { alias }
  );
  const stateSelectColor = data ? data.stateSelectColor : null;
  const productData = { product, productMain };

  const productDataRender = useProductDataRender({
    imgproperty,
    baseurl,
    qualityproductImg,
    productData,
    stateSelectColor,
  });

  if (!productDataRender) {
    return null;
  }

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={8} lg={7}>
        <ProductImgCarusel
          gal={productDataRender.gal}
          title={productDataRender.title}
        />
      </Grid>
      <Grid item xs={12} md={4} lg={5}>
        <ProductForMain
          product={productDataRender}
          currsymbol={currsymbol}
          baseurl={baseurl}
        />
      </Grid>
    </Grid>
  );
};

// ProductMainCard.defaultProps = {
//   currsymbol: "",
// };

// ProductMainCard.propTypes = {
//   productData: PropTypes.object.isRequired,
//   imgproperty: PropTypes.array.isRequired,
//   baseurl: PropTypes.string.isRequired,
//   qualityproductImg: PropTypes.number.isRequired,
//   currsymbol: PropTypes.string,
// };

export default ProductMainCard;
