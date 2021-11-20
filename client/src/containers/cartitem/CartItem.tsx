import { useEffect, useCallback, FC, SyntheticEvent } from "react";
import { useNavigate } from "react-router-dom";
import {
  createTheme,
  ThemeProvider,
  Theme,
  StyledEngineProvider, 
} from "@mui/material/styles";
import makeStyles from "@mui/styles/makeStyles";
import ListItem from "@mui/material/ListItem";
import Divider from "@mui/material/Divider";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemSecondaryAction from "@mui/material/ListItemSecondaryAction";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import LinkUi from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import { red } from "@mui/material/colors";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
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


declare module "@mui/styles/defaultTheme" {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface DefaultTheme extends Theme {}
}

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

const theme = createTheme({
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
  let navigate = useNavigate();

  const { alias, level1, level2, qty, price } = itemcart;

  const handleDeletItem = useCallback(() => {
    cartDeleteItem(index);
  }, [index]);

  const handleOpenProduct = (event: SyntheticEvent) => {
    event.preventDefault();
    event.stopPropagation();
    setColorAndSizeProduct(alias, level1, level2);
    navigate(productLink);
    if (handleClose) {
      handleClose();
    }
  };

  // event: ChangeEvent<{ name?: string | undefined; value: unknown }>
  // event: SelectChangeEvent<number>, child: ReactNode) => void
  const handleChangeQty = (event: SelectChangeEvent): void => {
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
          justifyContent="flex-start"
          alignItems="center"
        >
          <FormControl variant="standard" className={classes.formControl}>
            <InputLabel id="qty-simple-select-label">Количество</InputLabel>
            <Select
              labelId="qty-simple-select-label"
              value={String(qty)}
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
        underline="hover"
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
          <StyledEngineProvider injectFirst>
            <ThemeProvider theme={theme}>
              <IconButton
                edge="end"
                color="primary"
                onClick={handleDeletItem}
                size="large"
              >
                <DeleteIcon />
              </IconButton>
            </ThemeProvider>
          </StyledEngineProvider>
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
