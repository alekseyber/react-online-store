import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import LoaderPage from "../../components/loaderpage/LoaderPage";
import { setColorProductAction } from "../../redux/actions/productselect";
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

  const { baseUrl } = useSelector((state) => state.start);

  const dispatch = useDispatch();

  useEffect(() => {
    if (!loading && data && colors) {
      const status = data.productMain.level1GalArr.findeIndex(
        (el) => colors === el.alias
      );

      if (status > -1) {
        dispatch(
          setColorProductAction({
            alias,
            color: colors,
          })
        );
      } else {
        replace("/404");
      }
    }
  }, [dispatch, data, colors, loading, alias, replace]);

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

    const bind = {
      productData: { product, productMain },
      productImgProperty,
      qualityproductImg,
      currSymbol,
      bannersProduct,
      bannersProductOn,
      baseUrl,
      color: colors,
    };

    return <ProductMainPage {...bind} />;
  }
  return <ErrorContent />;
};
