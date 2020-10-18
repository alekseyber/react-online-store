import React from "react";
import { PageBase } from "../../hoc/PageBase";
import { useRouter } from "../../hooks/router.hook";
import LoaderPage from "../../components/loaderpage/LoaderPage";
import { cartAddPageAction } from "../../graphql/localVarsCart";
import { CART_ADD_PAGE_QUERY } from "../../graphql/gqlQuery";
import { useQueryApp } from "../../hooks/appolloQueryApp.hook";

export default () => {
  const { params, replace } = useRouter();
  const id = params.id;

  const onCompleted = (dataInput) => {
    if (dataInput) {
      const { alias, level1, level2, price } = dataInput.productCartItem;
      cartAddPageAction({ alias, level1, level2, price });
    }
    replace("/cart");
  };

  useQueryApp(
    CART_ADD_PAGE_QUERY,
    { id },
    false,
    true,
    "no-cache",
    onCompleted
  );

  const bind = {
    name_page: "Добавление товара в корзину",
    action_page: "Добавление в корзину",
    link_page: "/addcard",
    title: "Добавление товара в корзину",
    filter_on: false,
  };

  return (
    <PageBase {...bind}>
      <LoaderPage />
    </PageBase>
  );
};
