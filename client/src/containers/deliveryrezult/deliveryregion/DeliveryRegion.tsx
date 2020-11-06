import React from "react";
//import PropTypes from "prop-types";
import Typography from "@material-ui/core/Typography";
import DeliveryRezulText from "../../../components/deliveryrezulttext/DeliveryRezulText";
import DeliverySelector from "../../../components/deliveryreselector/DeliverySelector";
import { DeliveryRezultDeliveryDataFragment } from "../../../graphql/gqlQuery";

interface DeliveryRegionProps {
  pvz_selector?: boolean;
  sel_pvz_v?: boolean;
  currSymbol: string;
  textDeliveryProduct: string;
  deliveryData: DeliveryRezultDeliveryDataFragment;
  deliverySelect: number;
}

const DeliveryRegion: React.FC<DeliveryRegionProps> = ({
  pvz_selector = true,
  sel_pvz_v = true,
  currSymbol,
  textDeliveryProduct,
  deliveryData,
  deliverySelect = 0,
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
      {textDeliveryProduct && sel_pvz_v && (
        <Typography
          variant="body2"
          component="div"
          className="font-weight-black mt-2"
        >
          {textDeliveryProduct}
        </Typography>
      )}
    </>
  );
};
// DeliveryRegion.defaultProps = {
//   pvz_selector: false,
//   sel_pvz_v: true,
//   deliverySelect: 0,
// };

// DeliveryRegion.propTypes = {
//   pvz_selector: PropTypes.bool,
//   sel_pvz_v: PropTypes.bool,
//   currSymbol: PropTypes.string.isRequired,
//   textDeliveryProduct: PropTypes.string.isRequired,
//   deliveryData: PropTypes.object.isRequired,
//   deliverySelect: PropTypes.number,
// };

export default DeliveryRegion;
