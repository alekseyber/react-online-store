import React, { useEffect } from "react";
import LoaderPage from "../../components/loaderpage/LoaderPage";
import { setColorProductAction } from "../../graphql/localVarsCart";
import ProductMainPage from "../../containers/productmainpage/ProductMainPage";
import { useRouter } from "../../hooks/router.hook";
import { PRODUCT_PAGE_QUERY } from "../../graphql/gqlQuery";
import { useQueryApp } from "../../hooks/appolloQueryApp.hook";
import ErrorContent from "../../components/errorcontent/ErrorContent";

export default () => {
  const { replace, query, params } = useRouter();

  const { alias } = params;
  const { colors } = query;

  const { data, loading, error } = useQueryApp(
    PRODUCT_PAGE_QUERY,
    { alias },
    false,
    true
  ); 


  const product = data ? data.product : null;

  useEffect(() => {
    if (product && colors) {
      const level1 = product.level1Arr.find(
        (element) => element.alias === colors
      );

      if (level1) {
        setColorProductAction(product.alias, colors, level1.level2);
      } else {
        replace("/404");
      }
    }
  }, [product, colors, replace]);

  if (loading) return <LoaderPage />;

  if (data && !error) {
    const {
      productImgProperty,
      qualityproductImg,
      currSymbol,
      bannersProduct,
      bannersProductOn,
    } = data.paramsData;

    const { product, productMain } = data;
    const baseApiUrl = data.baseApiUrl

    const bind = {
      productData: { product, productMain },
      productImgProperty,
      qualityproductImg,
      currSymbol,
      bannersProduct,
      bannersProductOn,
      baseApiUrl,
      color: colors,
    };

    return <ProductMainPage {...bind} />;
  }
  return <ErrorContent />;
};
