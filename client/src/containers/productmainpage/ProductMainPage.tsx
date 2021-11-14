import { useMemo, FC } from "react";
import Grid from "@mui/material/Grid";
import { styled } from "@mui/material/styles";
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

const CssRootDiv = styled("div")(({ theme }) => ({
  marginTop: theme.spacing(2),
  marginBottom: theme.spacing(5),
}));

interface ProductMainPageProps {
  data: IProductPage;
  color: string | null;
}

const ProductMainPage: FC<ProductMainPageProps> = ({ data, color }) => {
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
      <CssRootDiv>
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
      </CssRootDiv>
    </PageBase>
  );
};

export default ProductMainPage;
