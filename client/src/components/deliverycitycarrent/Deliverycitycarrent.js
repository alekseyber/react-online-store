import React from "react";
import { useDispatch } from "react-redux";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import { openDelivery } from "../../redux/actions/modaldialog";
import { DELIVERY_CITY_CARRENT_QUERY } from "../../graphql/gqlQuery";
import { useQueryApp } from "../../hooks/appolloQueryApp.hook";

const DeliveryCityCarrent = () => {
  const dispatch = useDispatch();
  const { data } = useQueryApp(DELIVERY_CITY_CARRENT_QUERY);

  const cityNameCurrent = data ? data.cityNameCurrent : "";

  const openDeliveryHandler = () => {
    dispatch(openDelivery());
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
