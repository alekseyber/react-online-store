import React, { useMemo } from "react";
//import { useSelector } from "react-redux";
import PropTypes from "prop-types";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";
import ProductContetnt from "../../components/productcontent/ProductContetnt";
import ProductItem from "../productitem/ProductItem";
import RecentlyViewed from "../recentlyviewed/RecentlyViewed";
import Breadcrumbs from "../../components/breadcrumbs/Breadcrumbs";
import ProductMainCard from "../productmaincard/ProductMainCard";
import { PageBase } from "../../hoc/PageBase";

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(5),
  },
}));

const ProductMainPage = ({
  productData,
  color,
  productImgProperty,
  qualityproductImg,
  currSymbol,
  bannersProduct,
  bannersProductOn,
  baseUrl,
}) => {
  const classes = useStyles();

  const meta = useMemo(() => {
    const rezult = {
      title: "",
      description: "",
      keywords: "",
      canonical: "",
    };
    if (productData.productMain) {
      let addColor = "";

      if (color) {
        if (color !== productData.product.color_default) {
          addColor = `?color=${color}`;
        }
      }

      rezult.title = productData.productMain.meta.title;
      rezult.description = productData.productMain.meta.description;
      rezult.keywords = productData.productMain.meta.keywords;
      rezult.canonical = `/product/${productData.product.alias}${addColor}`;
    }

    return rezult;
  }, [productData, color]);

  const contetntData = useMemo(() => {
    const rezult = {
      content: "",
      cartpr1: [],
      cartpr2: [],
    };

    if (productData.productMain) {
      rezult.content = productData.productMain.content;
      rezult.cartpr1 = productData.productMain.filter.cartpr1;
      rezult.cartpr2 = productData.productMain.filter.cartpr2;
    }

    return rezult;
  }, [productData]);

  const { related, breadcrumbsData } = useMemo(() => {
    const rezult = {
      related: false,
      breadcrumbsData: [],
    };
    if (productData.productMain) {
      if (productData.productMain.related) {
        rezult.related = productData.productMain.related;
      }
      rezult.breadcrumbsData = productData.productMain.breadcrumbsparrent;
    }

    return rezult;
  }, [productData]);

  const bind = {
    name_page: meta.title,
    action_page: meta.description,
    meta_key: meta.keywords,
    link_page: meta.canonical,
    filter_on: false,
    meta_full: true,
    canonical_on: true,
    breadcrumbs_on: false,
  };

  return (
    <PageBase {...bind}>
      <div className={classes.root}>
        <ProductMainCard
          imgproperty={productImgProperty}
          baseurl={baseUrl}
          qualityproductImg={qualityproductImg}
          currsymbol={currSymbol}
          productData={productData}
        />
        <Breadcrumbs breadcrumbsData={breadcrumbsData} />
        <Grid container spacing={2}>
          <Grid item xs={12} md={8}>
            <ProductContetnt
              productContetntData={contetntData}
              bannersProduct={bannersProduct}
              bannersProductOn={bannersProductOn}
            />
          </Grid>
          {related && (
            <Grid item xs={12} md={4}>
              <ProductItem
                item={related}             
                imgproperty={productImgProperty}
                baseurl={baseUrl}
                quality={qualityproductImg}            
                currsymbol={currSymbol}
                related={true}
              />
            </Grid>
          )}
        </Grid>
        <RecentlyViewed
          alias={productData.product.alias}         
          imgproperty={productImgProperty}
          baseurl={baseUrl}
          quality={qualityproductImg}         
          currsymbol={currSymbol}
        />
      </div>
    </PageBase>
  );
};

ProductMainPage.propTypes = {
  color: PropTypes.oneOfType([PropTypes.oneOf([undefined]), PropTypes.string]),
  productData: PropTypes.object.isRequired,
  productImgProperty: PropTypes.array.isRequired,
  qualityproductImg: PropTypes.number.isRequired,
  currSymbol: PropTypes.string.isRequired,
  bannersProduct: PropTypes.array.isRequired,
  bannersProductOn: PropTypes.bool,
  baseUrl: PropTypes.string.isRequired,
};

export default ProductMainPage;
