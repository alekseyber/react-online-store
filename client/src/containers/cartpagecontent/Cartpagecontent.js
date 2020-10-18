import React from "react";
import { useDispatch } from "react-redux";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import CartNulled from "../../components/cartnulled/CartNulled";
import CartList from "../cartlist/CartList";
import CartSumm from "../../components/cartsumm/CartSumm";
import CartAddCupon from "../../components/cartaddcupon/CartAddCupon";
import AppForm from "../../components/appform/AppForm";
import { sendOrder } from "../../redux/actions/order";
import { useQueryApp } from "../../hooks/appolloQueryApp.hook";
import { CART_DATA_QUERY } from "../../graphql/gqlQuery";

const useStyles = makeStyles((theme) => ({
  root: {
    marginBottom: theme.spacing(3),
  },
}));

const CartPageContent = ({
  phone,
  currSymbol,  
  categoryRootLink,
  cityDefault,
}) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  
  const { data } = useQueryApp(CART_DATA_QUERY);
  const cartData = data ? data.cartData : [];



  const handleSubmit = (data) => {
    dispatch(sendOrder(data));
  };

  if (cartData.length === 0) {
    return <CartNulled categoryRootLink={categoryRootLink} phone={phone} />;
  }

  return (
    <Grid container spacing={2} className={classes.root}>
      <Grid item xs={12} md={6}>
        <Typography variant="h5" component="h1">
          Оформить заказ
        </Typography>
        <Divider />
        <Typography
          variant="caption"
          component="div"
          color="textSecondary"
          className="mt-1"
        >
          Контактная информация
        </Typography>
        <AppForm handleInputSubmit={handleSubmit} />
      </Grid>
      <Grid item xs={12} md={6}>
        <Typography variant="h6" component="h2">
          Состав заказа
        </Typography>
        <Divider />
        <CartList full={true} />
        <CartAddCupon />
        <CartSumm currSymbol={currSymbol} cityDefault={cityDefault} />
      </Grid>
    </Grid>
  );
};

CartPageContent.propTypes = {  
  phone: PropTypes.object.isRequired,
  currSymbol: PropTypes.string.isRequired,
  categoryRootLink: PropTypes.string.isRequired,
  cityDefault: PropTypes.object.isRequired,
};

export default CartPageContent;
