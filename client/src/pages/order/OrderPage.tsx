import { FC } from "react";
import { PageBase } from "../../hoc/PageBase";
import { useIdParams } from "../../hooks/use-alias-params.hook";
import OrderInfPage from "../../components/orderinfpage/OrderInfPage";
//import LoaderPage from "../../components/loaderpage/LoaderPage";
import PageSceleton from "../../components/skeletons/PageSceleton";
import ContentSceleton from "../../components/skeletons/ContentSceleton";
import {
  ORDER_PAGE_QUERY,
  IOrderPage,
  IOrderPageVar,
} from "../../graphql/gqlQuery";
import { useQueryApp } from "../../hooks/appolloQueryApp.hook";

const OrderPage: FC = () => {
  const id = useIdParams();

  const { data, loading, error } = useQueryApp<IOrderPage, IOrderPageVar>(
    ORDER_PAGE_QUERY,
    { id },
    false,
    true
  );

  if (loading)
    return (
      <PageSceleton title={true}>
        <ContentSceleton />
      </PageSceleton>
    );

  if (data && !error) {
    const { currSymbol } = data.paramsData;
    const baseApiUrl = data.baseApiUrl;

    const bind = {
      name_page: `Заказ № ${data.order.orderNum}`,
      action_page: `Заказ № ${data.order.orderNum}`,
      link_page: "/order",
      title: `Заказ № ${data.order.orderNum}.`,
      filter_on: true,
    };

    return (
      <PageBase {...bind}>
        <OrderInfPage
          data={data.order}
          currSymbol={currSymbol}
          baseApiUrl={baseApiUrl}
        />
      </PageBase>
    );
  }
  if (error) {
    return <PageBase error={true}></PageBase>;
  }
  return null;
};

export default OrderPage;
