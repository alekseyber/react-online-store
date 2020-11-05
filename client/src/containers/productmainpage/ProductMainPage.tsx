import React, { useMemo } from "react";
//import PropTypes from "prop-types";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";
import ProductContetnt from "../../components/productcontent/ProductContetnt";
import ProductItem from "../productitem/ProductItem";
import RecentlyViewed from "../recentlyviewed/RecentlyViewed";
import Breadcrumbs from "../../components/breadcrumbs/Breadcrumbs";
import ProductMainCard from "../productmaincard/ProductMainCard";
import { PageBase } from "../../hoc/PageBase";
import {
  IProductPage,
  TBreadcrumb,
  IProductContetntData,
} from "../../graphql/gqlQuery";

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(5),
  },
}));

interface ProductMainPageProps {
  data: IProductPage;
  color: string | null;
}

const ProductMainPage: React.FC<ProductMainPageProps> = ({ data, color }) => {
  const classes = useStyles();

  const {
    productImgProperty,
    qualityproductImg,
    currSymbol,
    bannersProduct,
    bannersProductOn,
  } = data.paramsData;

  const { product, productMain } = data;
  const baseApiUrl = data.baseApiUrl;
  //const productData = { product, productMain };

  const meta = useMemo(() => {
    const rezult = {
      title: "",
      description: "",
      keywords: "",
      canonical: "",
    };
    if (productMain) {
      let addColor = "";

      if (color) {
        if (color !== product.color_default) {
          addColor = `?color=${color}`;
        }
      }

      rezult.title = productMain.meta.title;
      rezult.description = productMain.meta.description;
      rezult.keywords = productMain.meta.keywords;
      rezult.canonical = `/product/${product.alias}${addColor}`;
    }

    return rezult;
  }, [product, productMain, color]);

  const contetntData = useMemo<IProductContetntData>(() => {
    const rezult: IProductContetntData = {
      content: "",
      cartpr1: [],
      cartpr2: [],
    };

    if (productMain) {
      rezult.content = productMain.content;
      rezult.cartpr1 = productMain.filter.cartpr1;
      rezult.cartpr2 = productMain.filter.cartpr2;
    }

    return rezult;
  }, [productMain]);

  const { related, breadcrumbsData } = useMemo<{
    related: string;
    breadcrumbsData: TBreadcrumb[];
  }>(() => {
    const rezult: {
      related: string;
      breadcrumbsData: TBreadcrumb[];
    } = {
      related: "",
      breadcrumbsData: [],
    };
    if (productMain) {
      if (productMain.related) {
        rezult.related = productMain.related;
      }
      rezult.breadcrumbsData = productMain.breadcrumbsparrent;
    }

    return rezult;
  }, [productMain]);

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
          baseurl={baseApiUrl}
          qualityproductImg={qualityproductImg}
          currsymbol={currSymbol}
          product={product}
          productMain={productMain}
        />
        <Breadcrumbs breadcrumbsData={breadcrumbsData} />
        <Grid container spacing={2}>
          <Grid item xs={12} md={8}>
            <ProductContetnt
              productContetntData={contetntData}
              bannersProduct={bannersProduct}
              bannersProductOn={bannersProductOn}
              baseApiUrl={baseApiUrl}
            />
          </Grid>
          {related && (
            <Grid item xs={12} md={4}>
              <ProductItem
                item={related}
                imgproperty={productImgProperty}
                quality={qualityproductImg}
                currsymbol={currSymbol}
                related={true}
              />
            </Grid>
          )}
        </Grid>
        <RecentlyViewed
          alias={product.alias}
          imgproperty={productImgProperty}
          quality={qualityproductImg}
          currsymbol={currSymbol}
        />
      </div>
    </PageBase>
  );
};

// ProductMainPage.propTypes = {
//   color: PropTypes.oneOfType([PropTypes.oneOf([undefined]), PropTypes.string]),
//   productData: PropTypes.object.isRequired,
//   productImgProperty: PropTypes.array.isRequired,
//   qualityproductImg: PropTypes.number.isRequired,
//   currSymbol: PropTypes.string.isRequired,
//   bannersProduct: PropTypes.array.isRequired,
//   bannersProductOn: PropTypes.bool,
//   baseApiUrl: PropTypes.string.isRequired,
// };

export default ProductMainPage;
