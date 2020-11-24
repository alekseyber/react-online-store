import { useState, useEffect, FC, SyntheticEvent } from "react";
import { makeStyles, ThemeProvider } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import Button from "@material-ui/core/Button";
import DoneIcon from "@material-ui/icons/Done";
import SendIcon from "@material-ui/icons/Send";
import AddShoppingCartIcon from "@material-ui/icons/AddShoppingCart";
import Divider from "@material-ui/core/Divider";
import Box from "@material-ui/core/Box";
import { setColorProductAction } from "../../graphql/localVarsCart";
import { cartAddAction } from "../../graphql/localVarsCart";
import ProductSizeSelector from "../productsizeselector/ProductSizeSelector";
import DeliveryRezult from "../../containers/deliveryrezult/DeliveryRezult";
import { IProductRezult } from "../../hooks/useProductDataRender.hook";
import { TProductLevel1 } from "../../graphql/gqlQuery";
import { themeBtnAddCart } from "../../theme";

const useStyles = makeStyles((theme) => ({
  rowinf: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
    // flexWrap: "wrap",
  },
  title: {
    fontWeight: 700,
    padding: `${theme.spacing(1)}px 0`,
  },
  price: {
    fontWeight: 700,
    color: theme.palette.priceprimary.main,
  },
  oldprice: {
    fontWeight: 700,
    marginLeft: theme.spacing(1),
    textDecoration: "line-through",
    color: theme.palette.priceprimary.light,
  },
  color: {
    "&:hover": {
      textDecoration: "none",
    },
    margin: theme.spacing(0.3),
    color: "#fff",
    minHeight: "28px",
    minWidth: "28px",
  },
  brand: {
    textAlign: "right",
    width: "55px",
    "& > img": {
      maxWidth: "55px",
    },
  },
  btnscart: {
    marginTop: theme.spacing(0.8),
    marginBottom: theme.spacing(0.8),
    //  margin: theme.spacing(0.8),
    // minWidth: 200,
  },
}));

interface ProductForMainProps {
  product: IProductRezult;
  currsymbol: string;
  baseurl: string;
}

interface ColorItemProps {
  item: TProductLevel1;
}

const ProductForMain: FC<ProductForMainProps> = ({
  product,
  currsymbol,
  baseurl,
}) => {
  const classes = useStyles();

  const [error, setError] = useState(false);

  useEffect(() => {
    setError(false);
  }, [product]);

  const sizeSelectVisible =
    product.product_model === 1 || product.product_model === 4;

  const preventDefault = (event: SyntheticEvent) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const handleColor = (event: SyntheticEvent, color: string) => {
    preventDefault(event);

    setColorProductAction(product.alias, color, product.current.level2);
  };

  const handleAddCart = (qorder: boolean = false) => {
    const err = cartAddAction(product, qorder);
    if (err) {
      setError(true);
    }
  };

  // console.log('current', product)

  const Colorlevel: FC = () => {
    if (product.product_model > 2) return null;

    const ColorItem: FC<ColorItemProps> = ({ item }) => {
      const href =
        product.color_default !== item.alias
          ? `${product.link}?colors=${item.alias}`
          : product.link;
      const style = {
        backgroundColor: "#" + item.colorItem.colorkey,
      };
      const onClick = (ev: SyntheticEvent) => handleColor(ev, item.alias);
      const params = { href, style, onClick };

      return (
        <IconButton {...params} className={classes.color} size="small">
          {item.alias === product.current.alias && <DoneIcon />}
        </IconButton>
      );
    };

    return (
      <div className={classes.rowinf}>
        <div>
          <Typography
            variant="subtitle1"
            component="span"
            color="textSecondary"
          >
            Текущий цвет:
          </Typography>
          <Typography
            variant="subtitle1"
            component="span"
            className="ml-1 text-uppercase font-weight-black"
          >
            {product.current.colorItem.title}
          </Typography>
        </div>
        <Typography variant="subtitle1" component="div" color="textSecondary">
          Выберите цвет:
        </Typography>
        {product.level1Arr.map((item, index) => (
          <ColorItem key={index} item={item} />
        ))}
      </div>
    );
  };

  return (
    <Card>
      <CardContent>
        <Grid
          container
          direction="row"
          justify="space-between"
          alignItems="center"
        >
          <Typography variant="subtitle1" color="textSecondary" component="div">
            {product.gender}
          </Typography>
          <div>
            <Typography
              variant="subtitle1"
              //   color="inherit"
              component="span"
              className={classes.price}
            >
              {product.price} {currsymbol}
            </Typography>
            {product.old_price > 0 && (
              <Typography
                variant="subtitle2"
                //  color="inherit"
                component="span"
                className={classes.oldprice}
              >
                {product.old_price} {currsymbol}
              </Typography>
            )}
          </div>
        </Grid>
        <Divider />
        <Typography variant="h6" component="h1" className={classes.title}>
          {product.title}
        </Typography>
        <Grid
          container
          direction="row"
          justify="space-between"
          alignItems="center"
          className={classes.rowinf}
        >
          <div>
            {product.sku && (
              <>
                <Typography
                  variant="subtitle1"
                  component="span"
                  color="textSecondary"
                >
                  Модель:
                </Typography>
                <Typography
                  variant="subtitle1"
                  component="span"
                  className="ml-1 text-uppercase font-weight-black"
                >
                  {product.sku}
                </Typography>
              </>
            )}
          </div>
          {product.brandItem && (
            <div className={classes.brand}>
              {product.brandItem.img && (
                <img
                  src={baseurl + product.brandItem.img}
                  alt={product.brandItem.title}
                />
              )}
            </div>
          )}
        </Grid>
        <Colorlevel />
        {sizeSelectVisible && (
          <div className={classes.rowinf}>
            <ProductSizeSelector
              level2={product.current.level2}
              alias={product.alias}
              sizesgroup_id={product.sizesgroup_id}
              error={error}
              set_error={setError}
            />
          </div>
        )}
        <ThemeProvider theme={themeBtnAddCart}>
          <Button
            variant="contained"
            color="primary"
            className={classes.btnscart}
            endIcon={<AddShoppingCartIcon />}
            fullWidth={true}
            onClick={() => handleAddCart(false)}
          >
            В корзину
          </Button>
          <Button
            variant="contained"
            color="secondary"
            className={classes.btnscart}
            endIcon={<SendIcon />}
            fullWidth={true}
            onClick={() => handleAddCart(true)}
          >
            Быстрый заказ
          </Button>
        </ThemeProvider>
        <Box mt={3}>
          <Divider />
          <DeliveryRezult
            pvz_selector={true}
            city_name_v={true}
            sel_pvz_v={false}
          />
        </Box>
      </CardContent>
    </Card>
  );
};

export default ProductForMain;
