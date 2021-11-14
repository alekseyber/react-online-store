import { FC } from "react";
import Typography from "@mui/material/Typography";
import DefaultDeliveryText from "./defaultdeliverytext/DefaultDeliveryText";
import DeliveryRegion from "./deliveryregion/DeliveryRegion";
import DeliveryCityCarrent from "../../components/deliverycitycarrent/DeliveryCityCarrent";
import { DELIVERY_REZULT_QUERY, IDeliveryRezult } from "../../graphql/gqlQuery";
import { useQueryApp } from "../../hooks/appolloQueryApp.hook";
import LoaderContent from "../../components/loadercontent/LoaderContent";

const getDeliveryDateHome = (maxDeliveryHourToday: number = 0): string => {
  let currentDate = new Date();
  const today = !(currentDate.getHours() > maxDeliveryHourToday);
  const start = today ? "сегодня" : "завтра";
  if (!today) {
    currentDate.setDate(currentDate.getDate() + 1);
  }
  const day = ("0" + currentDate.getDate()).slice(-2);
  const year = currentDate.getFullYear();
  const month = ("0" + (currentDate.getMonth() + 1)).slice(-2);

  return `${start} ${day}.${month}.${year}`;
};

interface DeliveryRezultProps {
  pvz_selector?: boolean;
  city_name_v?: boolean;
  sel_pvz_v?: boolean;
}

const DeliveryRezult: FC<DeliveryRezultProps> = ({
  pvz_selector = false,
  city_name_v = false,
  sel_pvz_v = true,
}) => {
  const { data, loading } = useQueryApp<IDeliveryRezult>(DELIVERY_REZULT_QUERY);

  // const cityIdCurrent = data ? data.cityIdCurrent : 44;
  // const status = data ? data.deliveryData.status : false;

  // const cityDefaultStatus = data
  //   ? data.paramsData.cityDefault.id === cityIdCurrent
  //   : true;
  // const deliverySelect = data ? data.deliverySelect : 0;

 

  if (loading) return <LoaderContent />;
  if (!data) return null;

  // const maxDeliveryHourToday = data.paramsData.maxDeliveryHourToday;

  const homeDat = getDeliveryDateHome(data.paramsData.maxDeliveryHourToday);

  const cityIdCurrent = data.cityIdCurrent;
  const status = data.deliveryData.status;

  const cityDefaultStatus = data.paramsData.cityDefault.id === cityIdCurrent;
  const deliverySelect = data.deliverySelect;

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
    deliverySelect,
  };

  const RezultBody: FC = () => {
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
// DeliveryRezult.defaultProps = {
//   pvz_selector: false,
//   city_name_v: false,
//   sel_pvz_v: true,
// };

// DeliveryRezult.propTypes = {
//   pvz_selector: PropTypes.bool,
//   city_name_v: PropTypes.bool,
//   sel_pvz_v: PropTypes.bool,
// };

export default DeliveryRezult;
