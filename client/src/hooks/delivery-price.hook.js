import { useSelector } from "react-redux";
import { DELIVERY_REZULT_QUERY } from "../graphql/gqlQuery";
import { useQueryApp } from "./appolloQueryApp.hook";

const useDeliveryPrice = (cityDefault) => {
  const { city, deliverySelect } = useSelector((state) => state.app);
  const cityid = city.id;
  const { data } = useQueryApp(DELIVERY_REZULT_QUERY, { cityid });

  if (!data) return 0;

  const { courier, pvz, status } = data.deliveryData;

  const cityDefaultStatus = cityDefault.id === city.id;

  if (cityDefaultStatus || !status) {
    return 0;
  }

  const price =
    deliverySelect === 0 ? courier.priceByCurrency : pvz.priceByCurrency;

  return price;
};

export { useDeliveryPrice };
