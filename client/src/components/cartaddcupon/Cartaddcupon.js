import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import IconButton from "@material-ui/core/IconButton";
import InputAdornment from "@material-ui/core/InputAdornment";
import CloseIcon from "@material-ui/icons/Close";
import { useInput } from "../../hooks/input.hook";
import { cartSetCupon, cartClearCupon } from "../../graphql/localVarsCart";
import ButtonProgress from "../buttonprogress/ButtonProgress";
import { CART_ADD_CUPON_QUERY } from "../../graphql/gqlQuery";
import { useQueryApp } from "../../hooks/appolloQueryApp.hook";

const useStyles = makeStyles((theme) => ({
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
  },
  body: {
    alignItems: "center",
  },
}));

const CartAddCupon = () => {
  const classes = useStyles();

  const [skip, setSkip] = useState(true);
  const inputCupon = useInput("");
  const cuponText = inputCupon.value;

  const onCompleted = (dataInput) => {
    if (dataInput.getCupon) {
      cartSetCupon(dataInput.getCupon);
    } else {
      cartClearCupon();
    }
    setSkip(true);
  };

  const handleSetCupon = () => {
    setSkip(false);
  };

  const { loading } = useQueryApp(
    CART_ADD_CUPON_QUERY,
    { cuponText },
    false,
    false,
    "no-cache",
    onCompleted,
    skip
  );

  return (
    <Accordion>
      <AccordionSummary>
        <Typography className={classes.heading}>
          У меня есть промокод
        </Typography>
      </AccordionSummary>
      <AccordionDetails className={classes.body}>
        <TextField
          label="Введите промокод"
          {...inputCupon.bind}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={inputCupon.clear}
                  disabled={inputCupon.value.length === 0}
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <ButtonProgress
          variant="contained"
          color="primary"
          size="small"
          className="ml-2"
          onClick={handleSetCupon}
          loading={loading}
          disabled={
            !(inputCupon.value.length > 5 && inputCupon.value.length < 12)
          }
        >
          Применить
        </ButtonProgress>
      </AccordionDetails>
    </Accordion>
  );
};

export default CartAddCupon;
