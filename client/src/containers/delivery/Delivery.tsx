import { FC } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import DeliveryBanners from "../../components/deliverybanners/DeliveryBanners";
import DeliveryCity from "../../components/deliverycity/DeliveryCity";
import DeliveryRezult from "../deliveryrezult/DeliveryRezult";

const Delivery: FC = () => {
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
