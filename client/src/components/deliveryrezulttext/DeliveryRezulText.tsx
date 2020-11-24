import { FC } from "react";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import DeliveryPvzDescrNoProps from "../deliverypvzdescrnoprops/DeliveryPvzDescrNoProps";

interface DeliveryRezulTextProps {
  pvz?: boolean;
  sel_pvz_v?: boolean;
  price: number;
  currSymbol: string;
  dateMax: string;
}

const DeliveryRezulText: FC<DeliveryRezulTextProps> = ({
  pvz = false,
  price,
  currSymbol,
  dateMax,
  sel_pvz_v,
}) => {
  const title = pvz
    ? "Забрать в пункте выдачи заказов (ПВЗ):"
    : "Курьер доставит по адресу:";
  const descr = pvz
    ? "При поступлении в ПВЗ Вы получите уведомление."
    : "Курьер позвонит перед доставкой.";
  const pvzSelectedVisible = sel_pvz_v && pvz;

  return (
    <Box mt={1} mb={1}>
      <Typography
        variant="subtitle2"
        component="div"
        gutterBottom
        className="font-weight-black"
      >
        {title}
      </Typography>
      <div>
        <Typography variant="body2" component="span" color="textSecondary">
          Стоимость доставки:
        </Typography>
        <Typography
          variant="body2"
          component="span"
          className="font-weight-black ml-1"
        >
          {price} {currSymbol}
        </Typography>
      </div>
      <div>
        <Typography variant="body2" component="span" color="textSecondary">
          Срок доставки:
        </Typography>
        <Typography
          variant="body2"
          component="span"
          className="font-weight-black ml-1"
        >
          {dateMax}
        </Typography>
      </div>
      <Typography
        variant="body2"
        component="div"
        color="textSecondary"
        className="font-weight-black"
      >
        {descr}
      </Typography>
      {pvzSelectedVisible && <DeliveryPvzDescrNoProps />}
    </Box>
  );
};


export default DeliveryRezulText;
