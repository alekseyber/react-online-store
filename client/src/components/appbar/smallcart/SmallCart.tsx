import { FC, useState, SyntheticEvent } from "react";
import { Link } from "react-router-dom";
import Button from "@mui/material/Button";
import withStyles from '@mui/styles/withStyles';
import makeStyles from '@mui/styles/makeStyles';
import Popover from "@mui/material/Popover";
import Typography from "@mui/material/Typography";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import Badge from "@mui/material/Badge";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Divider from "@mui/material/Divider";
import CartList from "../../../containers/cartlist/CartList";
import { CART_DATA_QUERY, ICartData } from "../../../graphql/gqlQuery";
import { useQueryApp } from "../../../hooks/appolloQueryApp.hook";

const MenuButton = withStyles(() => ({
  root: {
    fontWeight: 700,
    padding: "0 16px",
    fontSize: ".875rem",
    minWidth: "64px",
    minHeight: "100%",
  },
}))(Button);

const useStyles = makeStyles((theme) => ({
  root: {
    "& .MuiBadge-root > span": {
      marginLeft: theme.spacing(-1.5),
      color: "#fff",
    },
  },
}));

const SmallCart: FC = () => {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState<(EventTarget & HTMLElement) | null>(
    null
  );

  const { data } = useQueryApp<ICartData>(CART_DATA_QUERY);

  if (!data) {
    return null;
  }

  // const cartData = data ? data.cartData : [];
  const cartData = data.cartData;
  const count: number = cartData.length;

  const handleClick = (event: SyntheticEvent<HTMLElement>) => {
    if (anchorEl) {
      setAnchorEl(null);
    } else {
      setAnchorEl(event.currentTarget);
    }
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "cart-popover" : undefined;

  return (
    <div className={classes.root}>
      <MenuButton
        size="medium"
        aria-describedby={id}
        color="inherit"
        onClick={handleClick}
      >
        {count > 0 && (
          <Badge
            color="secondary"
            badgeContent={count}
            anchorOrigin={{
              vertical: "top",
              horizontal: "left",
            }}
          >
            <ShoppingCartIcon />
          </Badge>
        )}
        {count === 0 && <ShoppingCartIcon />}
      </MenuButton>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
      >
        {count === 0 && (
          <Box p={2}>
            <Typography>К сожалению, на данный момент</Typography>
            <Typography>Ваша корзина пуста</Typography>
          </Box>
        )}
        {count > 0 && (
          <>
            <CartList handleClose={handleClose} />
            <Divider />
            <Box p={2}>
              <Grid
                container
                direction="row"
                justifyContent="center"
                alignItems="center"
              >
                <Button
                  variant="contained"
                  color="primary"
                  component={Link}
                  to="/cart"
                  onClick={handleClose}
                >
                  Оформить заказ
                </Button>
              </Grid>
            </Box>
          </>
        )}
      </Popover>
    </div>
  );
};

export default SmallCart;
