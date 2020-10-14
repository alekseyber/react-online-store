import React, { useMemo } from "react";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import Typography from "@material-ui/core/Typography";
import DefaultDeliveryText from "./defaultdeliverytext/DefaultDeliveryText";
import DeliveryRegion from "./deliveryregion/DeliveryRegion";
import { useDeliveryDateHome } from "../../hooks/delivery-date-home.hook";
import DeliveryCityCarrent from "../../components/deliverycitycarrent/DeliveryCityCarrent";
import { DELIVERY_REZULT_QUERY } from "../../graphql/gqlQuery";
import { useQueryApp } from "../../hooks/appolloQueryApp.hook";
import LoaderContent from "../../components/loadercontent/LoaderContent";

const DeliveryRezult = ({ pvz_selector, city_name_v, sel_pvz_v }) => {
  const { city } = useSelector((state) => state.app);
  const cityid = city.id;

  const { data, loading } = useQueryApp(DELIVERY_REZULT_QUERY, { cityid });

  const { status, maxDeliveryHourToday, cityDefaultStatus } = useMemo(() => {
    const rezult = {
      status: false,
      maxDeliveryHourToday: 0,
      cityDefaultStatus: true,
    };
    if (data) {
      rezult.cityDefaultStatus = data.paramsData.cityDefault.id === cityid;
      rezult.status = data.deliveryData.status;
      rezult.maxDeliveryHourToday = data.paramsData.maxDeliveryHourToday;
    }

    return rezult;
  }, [cityid, data]);

  // const { status } = useSelector((state) => state.delivery);
  // const cityDefaultStatus = cityDefault.id === city.id;

  const homeDat = useDeliveryDateHome(maxDeliveryHourToday);

  if (loading) return <LoaderContent />;
  if (!data) return null;

  const {
    defaultDeliveryText,
    defaultDeliveryRegionText,
    currSymbol,
    textDeliveryProduct,
  } = data.paramsData;

  const bindDeliveryRegion = {
    currSymbol,
    textDeliveryProduct,
    pvz_selector,
    sel_pvz_v,
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
