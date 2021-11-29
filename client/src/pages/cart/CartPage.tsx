import { FC } from "react";
import { PageBase } from "../../hoc/PageBase";
import CartPageContent from "../../containers/cartpagecontent/CartPageContent";
import { CART_PAGE_QUERY, ICartPage } from "../../graphql/gqlQuery";
import { useQueryApp } from "../../hooks/appolloQueryApp.hook";
import ErrorContent from "../../components/errorcontent/ErrorContent";
import { RouteNames, getLinkByRoutePath } from "../../router";

const CartPage: FC = () => {
  const bind = {
    name_page: "Корзина",
    action_page: "Оформить заказ",
    link_page: RouteNames.CART_PAGE,
    filter_on: false,
  };

  const { data, error } = useQueryApp<ICartPage>(CART_PAGE_QUERY);

  if (error) {
    return <ErrorContent />;
  }

  if (!data) {
    return null;
  }

  const { phone, currSymbol, cityDefault } = data.paramsData;
  const { alias } = data.categoryTree;
  const categoryRootLink = getLinkByRoutePath("CATEGORY_PAGE", alias);

  const bindCartPageContent = {
    phone,
    currSymbol,
    categoryRootLink,
    cityDefault,
  };

  return (
    <PageBase {...bind}>
      <CartPageContent {...bindCartPageContent} />
    </PageBase>
  );
};

export default CartPage;
