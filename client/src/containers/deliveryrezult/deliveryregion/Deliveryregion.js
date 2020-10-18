import React from "react";
import PropTypes from "prop-types";
import Typography from "@material-ui/core/Typography";
import DeliveryRezulText from "../../../components/deliveryrezulttext/DeliveryRezulText";
import DeliverySelector from "../../../components/deliveryreselector/DeliverySelector";

const DeliveryRegion = ({
  pvz_selector,
  sel_pvz_v,
  currSymbol,
  textDeliveryProduct,
  deliveryData,
  deliverySelect,
}) => {
  const { courier, pvz } = deliveryData;

  const courierVisible =
    ((pvz_selector && deliverySelect === 0) || !pvz_selector) && courier;
  const pvzVisible =
    ((pvz_selector && deliverySelect === 1) || !pvz_selector) && courier;

  return (
    <>
      {pvz_selector && (
        <DeliverySelector
          pvz_price={pvz.priceByCurrency}
          courier_price={courier.priceByCurrency}
          deliverySelect={deliverySelect}
          currSymbol={currSymbol}
        />
      )}
      {courierVisible && (
        <DeliveryRezulText
          price={courier.priceByCurrency}
          dateMax={courier.deliveryDateMax}
          currSymbol={currSymbol}
        />
      )}
      {pvzVisible && (
        <DeliveryRezulText
          pvz={true}
          price={pvz.priceByCurrency}
          dateMax={pvz.deliveryDateMax}
          currSymbol={currSymbol}
          sel_pvz_v={sel_pvz_v}
        />
      )}
      {textDeliveryProduct && (
        <Typography
          variant="subtitle1"
          component="div"
          className="font-weight-black"
        >
          {textDeliveryProduct}
        </Typography>
      )}
    </>
  );
};
DeliveryRegion.defaultProps = {
  pvz_selector: false,
  sel_pvz_v: true,
  deliverySelect: 0,
};

DeliveryRegion.propTypes = {
  pvz_selector: PropTypes.bool,
  sel_pvz_v: PropTypes.bool,
  currSymbol: PropTypes.string.isRequired,
  textDeliveryProduct: PropTypes.string.isRequired,
  deliveryData: PropTypes.object.isRequired,
  deliverySelect: PropTypes.number,
};

export default DeliveryRegion;
