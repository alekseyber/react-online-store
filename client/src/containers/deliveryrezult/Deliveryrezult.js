import React from "react";
import PropTypes from "prop-types";
import Typography from "@material-ui/core/Typography";
import DefaultDeliveryText from "./defaultdeliverytext/DefaultDeliveryText";
import DeliveryRegion from "./deliveryregion/DeliveryRegion";
import { useDeliveryDateHome } from "../../hooks/delivery-date-home.hook";
import DeliveryCityCarrent from "../../components/deliverycitycarrent/DeliveryCityCarrent";
import { DELIVERY_REZULT_QUERY } from "../../graphql/gqlQuery";
import { useQueryApp } from "../../hooks/appolloQueryApp.hook";
import LoaderContent from "../../components/loadercontent/LoaderContent";
import { cityСurrentVar } from "../../graphql/localVars";

const DeliveryRezult = ({ pvz_selector, city_name_v, sel_pvz_v }) => {
  const cityСurrent = cityСurrentVar();
  const cityid = cityСurrent.id;

  const { data, loading } = useQueryApp(DELIVERY_REZULT_QUERY);

  const status = data ? data.deliveryData.status : false;
  const maxDeliveryHourToday = data ? data.paramsData.maxDeliveryHourToday : 0;
  const cityDefaultStatus = data
    ? data.paramsData.cityDefault.id === cityid
    : true;

  const homeDat = useDeliveryDateHome(maxDeliveryHourToday);

  if (loading) return <LoaderContent />;
  if (!data) return null;

  const {
    defaultDeliveryText,
    defaultDeliveryRegionText,
    currSymbol,
    textDeliveryProduct,
  } = data.paramsData;

  const deliveryData = data.deliveryData;

  const bindDeliveryRegion = {
    currSymbol,
    textDeliveryProduct,
    pvz_selector,
    sel_pvz_v,
    deliveryData,
  };

  const RezultBody = () => {
    if (cityDefaultStatus) {
      return (
        <>
          <DefaultDeliveryText content={defaultDeliveryText} />
          <div>
            <Typography variant="body2" component="span">
              Ближайшая дата доставки -
            </Typography>
            <Typography
              variant="body2"
              component="span"
              className="font-weight-black ml-1"
            >
              {homeDat}
            </Typography>
          </div>
        </>
      );
    }

    if (!status) {
      return <DefaultDeliveryText content={defaultDeliveryRegionText} />;
    }

    return <DeliveryRegion {...bindDeliveryRegion} />;
  };

  return (
    <>
      {city_name_v && <DeliveryCityCarrent />}
      <Typography
        variant="subtitle1"
        component="h3"
        gutterBottom
        className="font-weight-black"
      >
        Стоимость и сроки доставки:
      </Typography>
      <RezultBody />
    </>
  );
};
//input pvz_selector
DeliveryRezult.defaultProps = {
  pvz_selector: false,
  city_name_v: false,
  sel_pvz_v: true,
};

DeliveryRezult.propTypes = {
  pvz_selector: PropTypes.bool,
  city_name_v: PropTypes.bool,
  sel_pvz_v: PropTypes.bool,
};

export default DeliveryRezult;
