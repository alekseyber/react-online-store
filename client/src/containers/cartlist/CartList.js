import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import CartItem from "../cartitem/CartItem";
import CircularProgress from "@material-ui/core/CircularProgress";
import { CART_LIST_QUERY } from "../../graphql/gqlQuery";
import { useQueryApp } from "../../hooks/appolloQueryApp.hook";
import { cartClear } from "../../graphql/localVarsCart";

const useStyles = makeStyles((theme) => ({
  root: {
    //  width: "100%",
    backgroundColor: theme.palette.background.paper,
  },
  inline: {
    display: "inline",
  },
}));

const CartList = ({ full, handleClose }) => {
  const classes = useStyles();

  const { data, loading } = useQueryApp(CART_LIST_QUERY);

  const products = data ? data.products : [];
  const baseApiUrl = data ? data.baseApiUrl : "";
  const cartData = data ? data.cartData : [];
  
  const count = cartData.length;  

  useEffect(() => {
    if (!products.length && !loading) {
      cartClear();
    }
  }, [products, loading]);

  if (loading) {
    return (
      <List className={classes.root}>
        <ListItem>
          <ListItemIcon>
            <CircularProgress />
          </ListItemIcon>
          <ListItemText primary="Загрузка содержимого Вашей корзины..." />
        </ListItem>
      </List>
    );
  }

  if (!data) {
    return null;
  }

  const getItem = (index) => {
    if (index < products.length) {
      return products[index];
    }
    return null;
  };

  const keys = {};

  products.forEach((el, i) => {
    keys[el.alias] = i;
  });

  const { productImgProperty, currSymbol } = data.paramsData;

  return (
    <List className={classes.root}>
      {cartData.map((itemcart, index) => (
        <CartItem
          itemcart={itemcart}
          key={index}
          divider_on={count - 1 !== index}
          productImgProperty={productImgProperty}
          currsymbol={currSymbol}
          baseurl={baseApiUrl}
          index={index}
          full={full}
          handleClose={handleClose}
          product={getItem(keys[itemcart.alias])}
        />
      ))}
    </List>
  );
};

CartList.defaultProps = {
  full: false,
};

CartList.propTypes = {
  handleClose: PropTypes.oneOfType([
    PropTypes.oneOf([undefined]),
    PropTypes.func,
  ]),
  full: PropTypes.bool,
};

export default CartList;
