import { FC } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { openDelivery } from "../../graphql/localVarsModal";
import {
  DELIVERY_CITY_CARRENT_QUERY,
  IDeliveryCityCarrent,
} from "../../graphql/gqlQuery";
import { useQueryApp } from "../../hooks/appolloQueryApp.hook";

const DeliveryCityCarrent: FC = () => {
  const { data } = useQueryApp<IDeliveryCityCarrent>(
    DELIVERY_CITY_CARRENT_QUERY
  );

  const cityNameCurrent = data ? data.cityNameCurrent : "";

  const openDeliveryHandler = () => {
    openDelivery();
  };

  return (
    <Box mt={1} mb={1}>
      <Typography
        variant="subtitle2"
        component="span"
        color="textSecondary"
        className="mr-1"
      >
        Город:
      </Typography>
      <Typography
        variant="subtitle1"
        component="span"
        className="font-weight-black"
      >
        {cityNameCurrent}
      </Typography>
      <Button
        variant="contained"
        color="primary"
        size="small"
        className="ml-2"
        onClick={openDeliveryHandler}
      >
        Изменить
      </Button>
    </Box>
  );
};

export default DeliveryCityCarrent;
