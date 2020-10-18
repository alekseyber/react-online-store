import React from "react";
import PropTypes from "prop-types";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import ProductForCatalog from "../../components/productforcatalog/ProductForCatalog";
import { useProductDataRender } from "../../hooks/useProductDataRender.hook";
import { PRODUCT_ITEM_QUERY } from "../../graphql/gqlQuery";
import { useQueryApp } from "../../hooks/appolloQueryApp.hook";

const ProductItem = ({ item, imgproperty, quality, currsymbol, related }) => {
  const alias = item.alias ? item.alias : item;
  const colorselect = item.colorselect ? item.colorselect : null;

  const { data } = useQueryApp(PRODUCT_ITEM_QUERY, { alias });

  const baseurl = data ? data.baseApiUrl : "";

  const stateSelectColor = data ? data.stateSelectColor : null;

  const productDataRender = useProductDataRender({
    colorselect,
    imgproperty,
    baseurl,
    quality,
    productData: data,
    stateSelectColor,
  });

  if (!productDataRender) {
    return null;
  }

  if (related)
    return (
      <>
        <Typography gutterBottom variant="h6" component="h2">
          Вам также может понравиться
        </Typography>
        <ProductForCatalog
          product={productDataRender}
          currsymbol={currsymbol}
        />
      </>
    );

  return (
    <Grid item xs={12} sm={6} md={3}>
      <ProductForCatalog product={productDataRender} currsymbol={currsymbol} />
    </Grid>
  );
};

ProductItem.defaultProps = {
  currsymbol: "",
  related: false,
};

ProductItem.propTypes = {
  item: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
  imgproperty: PropTypes.array.isRequired,
  quality: PropTypes.number.isRequired,
  related: PropTypes.bool,
  currsymbol: PropTypes.string,
};

export default ProductItem;
