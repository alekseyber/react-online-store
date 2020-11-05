import React from "react";
//import PropTypes from 'prop-types';
import Box from "@material-ui/core/Box";
import DeliveryCityInput from "../deliverycityinput/DeliveryCityInput";
import DeliveryRezult from "../deliveryrezult/DeliveryRezult";

interface OrderDeliveryProps {
  variant: "filled" | "outlined" | "standard";
}

const OrderDelivery: React.FC<OrderDeliveryProps> = ({
  variant = "outlined",
}) => {
  return (
    <Box pt={2} pb={2}>
      <DeliveryCityInput variant={variant} />
      <DeliveryRezult pvz_selector={true} />
    </Box>
  );
};

// OrderDelivery.defaultProps = {
//     variant: 'outlined'
// };

// OrderDelivery.propTypes = {
//     variant: PropTypes.string,
// };

export default OrderDelivery;
