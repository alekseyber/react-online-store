import { DELIVERY_REZULT_QUERY } from "../graphql/gqlQuery";
import { useQueryApp } from "./appolloQueryApp.hook";

const useDeliveryPrice = (cityDefault) => {
  const { data } = useQueryApp(DELIVERY_REZULT_QUERY);

  if (!data) return 0;
  const { courier, pvz, status } = data.deliveryData;
  const deliverySelect = data.deliverySelect;
  const cityDefaultStatus = cityDefault.id === data.cityid;

  if (cityDefaultStatus || !status) {
    return 0;
  }

  const price =
    deliverySelect === 0 ? courier.priceByCurrency : pvz.priceByCurrency;

  return price;
};

export { useDeliveryPrice };
