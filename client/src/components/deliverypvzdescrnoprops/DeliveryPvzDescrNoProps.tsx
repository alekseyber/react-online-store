import { FC } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import DeliveryPvzDescr from "../deliverypvzdescr/DeliveryPvzDescr";
import {
  DELIVERY_PVZ_DESCR_NO_PROPS_QUERY,
  IDeliveryPvzDescrNoProps,
} from "../../graphql/gqlQuery";
import { useQueryApp } from "../../hooks/appolloQueryApp.hook";
import { openPvzSelector } from "../../graphql/localVarsModal";

const DeliveryPvzDescrNoProps: FC = () => {
  const { data } = useQueryApp<IDeliveryPvzDescrNoProps>(
    DELIVERY_PVZ_DESCR_NO_PROPS_QUERY
  );
  const pvzSelect = data ? data.pvzSelect : null;

  const openPvzSelectorHandler = () => {
    openPvzSelector();
  };

  const btnText = pvzSelect ? "Изменить ПВЗ" : "Выбрать ПВЗ";

  if (!pvzSelect) {
    return (
      <Button
        variant="contained"
        color="primary"
        size="small"
        className="mt-1"
        onClick={openPvzSelectorHandler}
      >
        {btnText}
      </Button>
    );
  }

  return (
    <Box mt={0.5} mb={0.5}>
      <Divider />
      <Box pt={1} pb={1}>
        <Typography
          variant="body2"
          component="div"
          className="font-weight-black"
          gutterBottom
        >
          Выбран ПВЗ:
        </Typography>
        <DeliveryPvzDescr item={pvzSelect} selected={true} />
        <Button
          variant="contained"
          color="primary"
          size="small"
          className="mt-1"
          onClick={openPvzSelectorHandler}
        >
          {btnText}
        </Button>
      </Box>
      <Divider />
    </Box>
  );
};

export default DeliveryPvzDescrNoProps;
