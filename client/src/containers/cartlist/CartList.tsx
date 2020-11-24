import { useEffect, FC } from "react";
import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import CircularProgress from "@material-ui/core/CircularProgress";
import CartItem from "../cartitem/CartItem";
import {
  CART_LIST_QUERY,
  ICartList,
  ProductFragment,
} from "../../graphql/gqlQuery";
import { useQueryApp } from "../../hooks/appolloQueryApp.hook";
import { cartClear } from "../../graphql/localVarsCart";

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.paper,
  },
  inline: {
    display: "inline",
  },
}));

interface CartListProps {
  handleClose?: () => void;
  full?: boolean;
}

const CartList: FC<CartListProps> = ({ full = false, handleClose }) => {
  const classes = useStyles();

  const { data, loading } = useQueryApp<ICartList>(CART_LIST_QUERY);

  useEffect(() => {
    if (data && !loading) {
      if (data.products.length === 0) {
        cartClear();
      }
    }
  }, [data, loading]);

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

  const products = data.products;
  const baseApiUrl = data.baseApiUrl;
  const cartData = data.cartData;
  const count: number = cartData.length;

  const getItem = (index: number): ProductFragment | null => {
    if (index < products.length) {
      return products[index];
    }
    return null;
  };

  const keys: { [alias: string]: number } = {};

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

// CartList.defaultProps = {
//   full: false,
// };

// CartList.propTypes = {
//   handleClose: PropTypes.oneOfType([
//     PropTypes.oneOf([undefined]),
//     PropTypes.func,
//   ]),
//   full: PropTypes.bool,
// };

export default CartList;
