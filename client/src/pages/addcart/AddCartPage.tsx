import React from "react";
import { PageBase, IPageBaseProps } from "../../hoc/PageBase";
import { useRouter, useParamsMemo } from "../../hooks/router.hook";
import LoaderPage from "../../components/loaderpage/LoaderPage";
import { cartAddPageAction } from "../../graphql/localVarsCart";
import {
  CART_ADD_PAGE_QUERY,
  ICartAddPage,
  ICartAddPageVar,
} from "../../graphql/gqlQuery";
import { useQueryApp } from "../../hooks/appolloQueryApp.hook";

//const PageBaseRezult = PageBase;

const AddCartPage: React.FC = () => {
  const { params } = useParamsMemo<{ id: string }>();
  const { replace } = useRouter();
  const id = params.id;

  const onCompleted = (dataInput: ICartAddPage) => {
    if (dataInput) {
      const { alias, level1, level2, price } = dataInput.productCartItem;
      cartAddPageAction({ alias, level1, level2, price });
    }
    replace("/cart");
  };

  useQueryApp<ICartAddPage, ICartAddPageVar>(
    CART_ADD_PAGE_QUERY,
    { id },
    false,
    true,
    "no-cache",
    onCompleted
  );

  const bind: IPageBaseProps = {
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

export default AddCartPage;
