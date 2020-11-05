import React from "react";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import DeliveryBanners from "../../components/deliverybanners/DeliveryBanners";
import DeliveryCity from "../../components/deliverycity/DeliveryCity";
import DeliveryRezult from "../deliveryrezult/DeliveryRezult";

const Delivery: React.FC = () => {
  return (
    <>
      <DeliveryBanners />
      <DeliveryCity />
      <Card>
        <CardContent>
          <DeliveryRezult />
        </CardContent>
      </Card>
    </>
  );
};

export default Delivery;
