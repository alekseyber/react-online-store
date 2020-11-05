import React from "react";
import DeliveryPvzSelComp from "../../components/deliveryrepvzselcomp/DeliveryPvzSelComp";
import { DELIVERY_PVZ_SELECTOR_QUERY, IDeliveryPvzSelector } from "../../graphql/gqlQuery";
import { useQueryApp } from "../../hooks/appolloQueryApp.hook";
import LoaderContent from "../../components/loadercontent/LoaderContent";
import ErrorContent from "../../components/errorcontent/ErrorContent";

const DeliveryPvzSelector = () => {
  const { data, loading, error } = useQueryApp<IDeliveryPvzSelector>(DELIVERY_PVZ_SELECTOR_QUERY);

  if (loading) return <LoaderContent />;
  if (error) return <ErrorContent />;
  if (!data) return null;

  return <DeliveryPvzSelComp dataInput={data} />;
};

export default DeliveryPvzSelector;
