import { useEffect, FC } from "react";
import { setColorProductAction } from "../../graphql/localVarsCart";
import ProductMainPage from "../../containers/productmainpage/ProductMainPage";
import ProductMainCardSceleton from "../../components/skeletons/ProductMainCardSceleton";
import PageSceleton from "../../components/skeletons/PageSceleton";
import { useRouter, useParamsMemo, useQuery } from "../../hooks/router.hook";
import {
  PRODUCT_PAGE_QUERY,
  IProductPage,
  IProductPageVars,
} from "../../graphql/gqlQuery";
import { useQueryApp } from "../../hooks/appolloQueryApp.hook";
import ErrorContent from "../../components/errorcontent/ErrorContent";

const ProductPage: FC = () => {
  const { replace } = useRouter();
  const { params } = useParamsMemo<{ alias: string }>();
  const query = useQuery(true);

  const { alias } = params;
  const colors = query.colors || null;

  const { data, loading, error } = useQueryApp<IProductPage, IProductPageVars>(
    PRODUCT_PAGE_QUERY,
    { alias },
    false,
    true
  );

  const product = data ? data.product : null;

  useEffect(() => {
    if (product && colors) {
      const colorsPattern = colors.toString();
      const level1 = product.level1Arr.find(
        (element) => element.alias === colorsPattern
      );

      if (level1) {
        setColorProductAction(product.alias, colorsPattern, level1.level2);
      } else {
        replace("/404");
      }
    }
  }, [product, colors, replace]);

  if (loading) {
    return (
      <PageSceleton>
        <ProductMainCardSceleton />
      </PageSceleton>
    );
  }

  if (data && !error) {
    const bind = {
      data,
      color: colors ? colors.toString() : null,
    };

    return <ProductMainPage {...bind} />;
  }
  return <ErrorContent />;
};

export default ProductPage;
