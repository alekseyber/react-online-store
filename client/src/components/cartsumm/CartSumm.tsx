import React from "react";
//import PropTypes from "prop-types";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles"; //makeStyles,
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import { green } from "@material-ui/core/colors";
import { useCartSumm } from "../../hooks/cart-summ.hook";
import { useDeliveryPrice } from "../../hooks/delivery-price.hook";
import { ICity } from "../../graphql/localVars";

const theme = createMuiTheme({
  palette: {
    primary: {
      main: green[600],
    },
  },
});

interface CartSummProps {
  cityDefault: ICity;
  currSymbol: string;
}

const CartSumm: React.FC<CartSummProps> = ({ currSymbol, cityDefault }) => {
  const summData = useCartSumm();
  const deliveryPrice = useDeliveryPrice(cityDefault);

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
        <ThemeProvider theme={theme}>
          <Typography
            variant="h6"
            component="span"
            color="primary"
            className="ml-1 font-weight-black"
          >
            {summData.summcupon} {currSymbol}
          </Typography>
        </ThemeProvider>
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
            <ThemeProvider theme={theme}>
              <Typography
                variant="h6"
                component="span"
                color="primary"
                className="ml-1 font-weight-black"
              >
                {summData.summcupon + deliveryPrice} {currSymbol}
              </Typography>
            </ThemeProvider>
          </div>
        </>
      )}
    </Box>
  );
};

// CartSumm.propTypes = {
//   currSymbol: PropTypes.string.isRequired,
//   cityDefault: PropTypes.object.isRequired,
// };

export default CartSumm;
