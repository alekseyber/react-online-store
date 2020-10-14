import React, { useMemo, useEffect } from "react";
import PropTypes from "prop-types";
import { useDispatch } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import { useSelector } from "react-redux";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import CartItem from "../cartitem/CartItem";
import CircularProgress from "@material-ui/core/CircularProgress";
import { CART_LIST_QUERY } from "../../graphql/gqlQuery";
import { useQueryApp } from "../../hooks/appolloQueryApp.hook";
import { cartUpdate } from "../../redux/actions/cart";

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
  const dispatch = useDispatch();
  const classes = useStyles();
  const cartData = useSelector((state) => state.cart.cartData);

  const ids = useMemo(() => {
    const cartIdsObj = {};
    cartData.forEach((el) => {
      if (!cartData[el.alias]) {
        cartIdsObj[el.alias] = 1;
      }
    });
    return Object.keys(cartIdsObj);
  }, [cartData]);

  const { baseUrl } = useSelector((state) => state.start);

  const count = cartData.length;

  const { data, loading } = useQueryApp(CART_LIST_QUERY, { ids });
  useEffect(() => {
    if (data) {
      if (data.products.length === 0) {
        dispatch(cartUpdate([]));
      }
    }
  }, [data, dispatch, ids]);

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

  const { products } = data;

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
          baseurl={baseUrl}
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
