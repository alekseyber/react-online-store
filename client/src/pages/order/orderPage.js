import React from "react";
import { useSelector } from "react-redux";
import { PageBase } from "../../hoc/PageBase";
import { useRouter } from "../../hooks/router.hook";
import OrderInfPage from "../../components/orderinfpage/OrderInfPage";
import LoaderPage from "../../components/loaderpage/LoaderPage";
import { ORDER_PAGE_QUERY } from "../../graphql/gqlQuery";
import { useQueryApp } from "../../hooks/appolloQueryApp.hook";

export default () => {
  const { params } = useRouter();
  const id = params.id;
  const baseUrl = useSelector((state) => state.start.baseUrl);
  const { data, loading, error } = useQueryApp(
    ORDER_PAGE_QUERY,
    { id },
    false,
    true
  );

  if (loading) return <LoaderPage />;

  if (data && !error) {
    const { currSymbol } = data.paramsData;

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
          baseUrl={baseUrl}
        />
      </PageBase>
    );
  }
  if (error) {
    return <PageBase error={true}></PageBase>;
  }
  return null;
};
