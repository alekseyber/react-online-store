import { useEffect, useCallback, FC, SyntheticEvent, ChangeEvent } from "react";
import {
  createMuiTheme,
  ThemeProvider,
  makeStyles,
} from "@material-ui/core/styles";
//import PropTypes from "prop-types";
import ListItem from "@material-ui/core/ListItem";
import Divider from "@material-ui/core/Divider";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import Avatar from "@material-ui/core/Avatar";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import LinkUi from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";
import { red } from "@material-ui/core/colors";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import {
  setColorAndSizeProduct,
  cartDeleteItem,
  cartChangeItemCount,
  IItemCartData,
} from "../../graphql/localVarsCart";
import {
  ProductFragment,
  IProductImgPropertySmall,
  TProductLevel1,
  TProductLevel2,
} from "../../graphql/gqlQuery";

import SizeSelector from "./sizeselector/SizeSelector";
import ColorSelector from "./colorselector/ColorSelector";
import { useRouter } from "../../hooks/router.hook";

const useStyles = makeStyles((theme) => ({
  avatar: {
    width: 65,
    height: 65,
  },
  price: {
    fontWeight: 700,
    color: theme.palette.priceprimary.main,
    marginLeft: theme.spacing(1),
  },
  oldprice: {
    fontWeight: 700,
    marginLeft: theme.spacing(1),
    textDecoration: "line-through",
    color: theme.palette.priceprimary.light,
  },
  formControl: {
    marginTop: theme.spacing(0.5),
    marginBottom: theme.spacing(0.5),
    marginRight: theme.spacing(1),
    minWidth: 70,
  },
}));

const theme = createMuiTheme({
  palette: {
    primary: {
      main: red[500],
    },
  },
});

interface CartItemProps {
  handleClose?: () => void;
  full?: boolean;
  divider_on?: boolean;
  itemcart: IItemCartData;
  index: number;
  product: ProductFragment | null;
  productImgProperty: IProductImgPropertySmall[];
  baseurl: string;
  currsymbol: string;
}

const CartItem: FC<CartItemProps> = ({
  index,
  itemcart,
  productImgProperty,
  baseurl,
  currsymbol,
  divider_on = true,
  handleClose,
  full = false,
  product,
}) => {
  const classes = useStyles();
  const { history } = useRouter();

  const { alias, level1, level2, qty, price } = itemcart;

  const handleDeletItem = useCallback(() => {
    cartDeleteItem(index);
  }, [index]);

  const handleOpenProduct = (event: SyntheticEvent) => {
    event.preventDefault();
    event.stopPropagation();
    setColorAndSizeProduct(alias, level1, level2);
    history.push(productLink);
    if (handleClose) {
      handleClose();
    }
  };

  const handleChangeQty = (
    event: ChangeEvent<{ name?: string | undefined; value: unknown }>
  ): void => {
    const value = event.target.value;
    if (typeof value === "string") {
      cartChangeItemCount(index, parseInt(value, 10));
    }
    if (typeof value === "number") {
      cartChangeItemCount(index, value);
    }
  };

  let current: TProductLevel1 | undefined = undefined;
  let level2Current: TProductLevel2 | undefined = undefined;

  if (product) {
    current = product.level1Arr.find((el) => el.alias === level1);
  }

  if (current) {
    level2Current = current.level2.find((ell2) => ell2.alias === level2);
  }

  useEffect(() => {
    if (!product && !level2Current && !current) {
      handleDeletItem();
    }
  }, [product, level2Current, current, handleDeletItem]);

  if (!product || !level2Current || !current) {
    return null;
  }

  const levels1 = product.level1Arr.filter(
    (itemL1) => itemL1.level2.findIndex((l2) => l2.alias === level2) > -1
  );

  if (!levels1) {
    return null;
  }

  const productLink: string = `/product/${alias}`;
  const level2SelectTrue: boolean =
    product.product_model === 1 || product.product_model === 4;

  const level1SelectTrue: boolean = product.product_model < 3;

  const priceOld: number = current.old_price
    ? current.old_price
    : product.old_price;

  const img: string = baseurl + productImgProperty[0].path + current.img;

  const FullElement = () => {
    if (!full) {
      return null;
    }
    //    Array.apply(null, { length: N }).map((_, val) => (

    const N = qty <= 5 ? 5 : qty;

    return (
      <>
        <Grid
          container
          direction="row"
          justify="flex-start"
          alignItems="center"
        >
          <FormControl className={classes.formControl}>
            <InputLabel id="qty-simple-select-label">Количество</InputLabel>
            <Select
              labelId="qty-simple-select-label"
              value={qty}
              onChange={handleChangeQty}
            >
              {new Array(N).fill("").map((_, val) => (
                <MenuItem key={val} value={val + 1} dense={true}>
                  {val + 1}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <div>
            <Typography variant="body2" component="span" color="textSecondary">
              Сумма:
            </Typography>
            <Typography
              variant="body2"
              component="span"
              color="textPrimary"
              className="ml-1"
            >
              {qty * price} {currsymbol}
            </Typography>
          </div>
        </Grid>
        {level1SelectTrue && (
          <Box mt={1} mb={1}>
            <ColorSelector
              index={index}
              levels1={levels1}
              level1Cart={level1}
              level2Cart={level2}
              product={product}
            />
          </Box>
        )}
        {level2SelectTrue && current && (
          <Box mt={1} mb={1}>
            <SizeSelector
              index={index}
              levels2={current.level2}
              level2Cart={level2}
            />
          </Box>
        )}
      </>
    );
  };

  const primaryEl = (
    <div className="mb-1">
      <LinkUi
        variant="body2"
        className="font-weight-black"
        href={productLink}
        onClick={handleOpenProduct}
      >
        {product.title} {product.gender}
      </LinkUi>
    </div>
  );
  const secondaryEl = (
    <div>
      <div>
        {level1SelectTrue && (
          <>
            <Typography variant="body2" component="span" color="textSecondary">
              Цвет:
            </Typography>
            <Typography
              variant="body2"
              component="span"
              color="textPrimary"
              className="ml-1 mr-1 text-uppercase"
            >
              {current.colorItem.title}
            </Typography>
          </>
        )}
        {level2SelectTrue && (
          <>
            <Typography variant="body2" component="span" color="textSecondary">
              Размер:
            </Typography>
            <Typography
              variant="body2"
              component="span"
              color="textPrimary"
              className="ml-1 mr-1"
            >
              {level2Current.sizeItem.title}
            </Typography>
          </>
        )}
      </div>
      <div>
        <Typography variant="body2" component="span" color="textSecondary">
          Цена:
        </Typography>
        <Typography
          variant="body2"
          // color="secondary"
          component="span"
          className={classes.price}
        >
          {price} {currsymbol}
        </Typography>
        {priceOld > 0 && (
          <Typography
            variant="body2"
            //   color="textSecondary"
            component="span"
            className={classes.oldprice}
          >
            {priceOld} {currsymbol}
          </Typography>
        )}
      </div>
      <FullElement />
    </div>
  );

  return (
    <>
      <ListItem alignItems="flex-start">
        <ListItemAvatar>
          <Avatar
            alt={product.title}
            src={img}
            className={classes.avatar}
            variant="square"
          />
        </ListItemAvatar>
        <ListItemText
          primary={primaryEl}
          secondary={secondaryEl}
          disableTypography={true}
        />

        <ListItemSecondaryAction>
          <ThemeProvider theme={theme}>
            <IconButton edge="end" color="primary" onClick={handleDeletItem}>
              <DeleteIcon />
            </IconButton>
          </ThemeProvider>
        </ListItemSecondaryAction>
      </ListItem>
      {divider_on && <Divider variant="inset" component="li" />}
    </>
  );
};

// CartItem.defaultProps = {
//   currsymbol: "",
//   baseurl: "",
//   divider_on: true,
//   full: false,
// };

// CartItem.propTypes = {
//   index: PropTypes.number.isRequired,
//   itemcart: PropTypes.object.isRequired,
//   productImgProperty: PropTypes.array.isRequired,
//   baseurl: PropTypes.string,
//   currsymbol: PropTypes.string,
//   divider_on: PropTypes.bool,
//   handleClose: PropTypes.func,
//   full: PropTypes.bool,
//   product: PropTypes.oneOfType([PropTypes.object.isRequired, () => null]),
// };

export default CartItem;
