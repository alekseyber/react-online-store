import { DELIVERY_REZULT_QUERY, IDeliveryRezult } from "../graphql/gqlQuery";
import { ICity } from "../graphql/localVars";
import { useQueryApp } from "./appolloQueryApp.hook";

const useDeliveryPrice = (cityDefault: ICity): number => {
  const { data } = useQueryApp<IDeliveryRezult>(DELIVERY_REZULT_QUERY);

  if (!data) return 0;
  const { courier, pvz, status } = data.deliveryData;
  const deliverySelect = data.deliverySelect;
  const cityDefaultStatus = cityDefault.id === data.cityIdCurrent;

  if (cityDefaultStatus || !status) {
    return 0;
  }

  const price =
    deliverySelect === 0 ? courier.priceByCurrency : pvz.priceByCurrency;

  return price;
};

export { useDeliveryPrice };
