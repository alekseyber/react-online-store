import { FC } from "react";
import makeStyles from '@mui/styles/makeStyles';
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useCartSumm } from "../../hooks/cart-summ.hook";
import { useDeliveryPrice } from "../../hooks/delivery-price.hook";
import { ICity } from "../../graphql/localVars";

const useStyles = makeStyles((theme) => ({
  summprice: {
    fontWeight: 700,
    color: theme.palette.priceprimary.dark,
    marginLeft: theme.spacing(1),
  },
}));

interface CartSummProps {
  cityDefault: ICity;
  currSymbol: string;
}

const CartSumm: FC<CartSummProps> = ({ currSymbol, cityDefault }) => {
  const summData = useCartSumm();
  const deliveryPrice = useDeliveryPrice(cityDefault);
  const classes = useStyles();

  if (summData.summcupon === 0) {
    return null;
  }

  return (
    <Box m={1}>
      {summData.discont > 0 && (
        <>
          <div>
            <Typography variant="body2" component="span" color="textSecondary">
              Сумма без скидки:
            </Typography>
            <Typography
              variant="subtitle2"
              component="span"
              color="textPrimary"
              className="ml-1"
            >
              {summData.summ} {currSymbol}
            </Typography>
          </div>
          <div>
            <Typography variant="body2" component="span" color="textSecondary">
              Скидка:
            </Typography>
            <Typography
              variant="subtitle2"
              component="span"
              color="textPrimary"
              className="ml-1"
              gutterBottom={true}
            >
              {summData.discont} {currSymbol}
            </Typography>
          </div>
        </>
      )}
      <div>
        <Typography variant="body1" component="span" color="textSecondary">
          Итого:
        </Typography>
        {/* <ThemeProvider theme={theme}> */}
        <Typography
          variant="h6"
          component="span"
          //  color="primary"
          className={classes.summprice}
        >
          {summData.summcupon} {currSymbol}
        </Typography>
        {/* </ThemeProvider> */}
      </div>
      {deliveryPrice > 0 && (
        <>
          <div>
            <Typography variant="body1" component="span" color="textSecondary">
              Доставка:
            </Typography>
            <Typography
              variant="subtitle2"
              component="span"
              color="textPrimary"
              className="ml-1"
              gutterBottom={true}
            >
              {deliveryPrice} {currSymbol}
            </Typography>
          </div>
          <div>
            <Typography variant="body1" component="span" color="textSecondary">
              Итого с доставкой:
            </Typography>
            <Typography
              variant="h6"
              component="span"
              //    color="inherit"
              className={classes.summprice}
            >
              {summData.summcupon + deliveryPrice} {currSymbol}
            </Typography>
          </div>
        </>
      )}
    </Box>
  );
};

export default CartSumm;
