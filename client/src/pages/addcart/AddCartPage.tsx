import { FC } from "react";
import { PageBase, IPageBaseProps } from "../../hoc/PageBase";
import { useNavigate } from "react-router-dom";
import { useIdParams } from "../../hooks/use-alias-params.hook";
import LoaderPage from "../../components/loaderpage/LoaderPage";
import { cartAddPageAction } from "../../graphql/localVarsCart";
import { getLinkByRoutePath } from "../../router";
import {
  CART_ADD_PAGE_QUERY,
  ICartAddPage,
  ICartAddPageVar,
} from "../../graphql/gqlQuery";
import { useQueryApp } from "../../hooks/appolloQueryApp.hook";

//const PageBaseRezult = PageBase;

const AddCartPage: FC = () => {
  const id = useIdParams();

  const navigate = useNavigate();

  const onCompleted = (dataInput: ICartAddPage) => {
    if (dataInput) {
      const { alias, level1, level2, price } = dataInput.productCartItem;
      cartAddPageAction({ alias, level1, level2, price });
    }
    navigate("/cart", { replace: true });
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
    link_page: getLinkByRoutePath("ADD_CART_PAGE", id),
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
