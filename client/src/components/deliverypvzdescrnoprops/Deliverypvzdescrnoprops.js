import React from "react";
import { useSelector, useDispatch } from "react-redux";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import DeliveryPvzDescr from "../deliverypvzdescr/DeliveryPvzDescr";
import { openPvzSelector } from "../../redux/actions/modaldialog";

const DeliveryPvzDescrNoProps = () => {
  const { pvzSelect, city } = useSelector((state) => state.app);  
  const dispatch = useDispatch();

  const openPvzSelectorHandler = () => {
    dispatch(openPvzSelector());
  };

  let selected = false;
  if (pvzSelect) {
    selected = city.id === pvzSelect.cityid;
  }
  const btnText = selected ? "Изменить ПВЗ" : "Выбрать ПВЗ";

  if (!selected) {
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
