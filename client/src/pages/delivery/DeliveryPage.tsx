import { FC } from "react";
import { PageBase } from "../../hoc/PageBase";
import Delivery from "../../containers/delivery/Delivery";
import { RouteNames } from "../../router";

const DeliveryPage: FC = () => {
  const bind = {
    name_page: "Доставка",
    action_page: "Доставка с примеркой во все города России",
    link_page: RouteNames.DELIVERY_PAGE,
    title: "О доставке и оплате",
  };

  return (
    <PageBase {...bind}>
      <Delivery />
    </PageBase>
  );
};

export default DeliveryPage;
