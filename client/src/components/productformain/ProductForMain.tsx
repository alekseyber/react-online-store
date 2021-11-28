import { useState, useEffect, FC, SyntheticEvent, RefObject } from "react";
import { ThemeProvider } from "@mui/material/styles"; //Theme, , StyledEngineProvider
//import makeStyles from "@mui/styles/makeStyles";
import { styled } from "@mui/material/styles";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import DoneIcon from "@mui/icons-material/Done";
import SendIcon from "@mui/icons-material/Send";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import Divider from "@mui/material/Divider";
import Box from "@mui/material/Box";
import { setColorProductAction } from "../../graphql/localVarsCart";
import { cartAddAction } from "../../graphql/localVarsCart";
import ProductSizeSelector from "../productsizeselector/ProductSizeSelector";
import DeliveryRezult from "../../containers/deliveryrezult/DeliveryRezult";
import { IProductRezult } from "../../hooks/useProductDataRender.hook";
import { TProductLevel1 } from "../../graphql/gqlQuery";
import { themeBtnAddCart } from "../../theme";

// declare module '@mui/styles/defaultTheme' {
//   // eslint-disable-next-line @typescript-eslint/no-empty-interface
//   interface DefaultTheme extends Theme {}
// }

const CssRootCard = styled(Card)(({ theme }) => ({
  "& .productForMain-rowinf": {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  "& .productForMain-title": {
    fontWeight: 700,
    padding: `${theme.spacing(1)} 0`,
  },
  "& .productForMain-price": {
    fontWeight: 700,
    color: theme.palette.priceprimary.main,
  },
  "& .productForMain-oldprice": {
    fontWeight: 700,
    marginLeft: theme.spacing(1),
    textDecoration: "line-through",
    color: theme.palette.priceprimary.light,
  },
  "& .productForMain-color": {
    "&:hover": {
      textDecoration: "none",
    },
    margin: theme.spacing(0.3),
    color: "#fff",
    minHeight: "28px",
    minWidth: "28px",
  },
  "& .productForMain-btnscart": {
    marginTop: theme.spacing(0.8),
    marginBottom: theme.spacing(0.8),
  },
  "& .productForMain-paramName": {
    marginLeft: theme.spacing(1),
    fontWeight: 700,
    textTransform: "uppercase",
  },
}));

// const useStyles = makeStyles((theme) => ({
//   rowinf: {
//     marginTop: theme.spacing(2),
//     marginBottom: theme.spacing(2),
//     // flexWrap: "wrap",
//   },
//   title: {
//     fontWeight: 700,
//     padding: `${theme.spacing(1)} 0`,
//   },
//   price: {
//     fontWeight: 700,
//     color: theme.palette.priceprimary.main,
//   },
//   oldprice: {
//     fontWeight: 700,
//     marginLeft: theme.spacing(1),
//     textDecoration: "line-through",
//     color: theme.palette.priceprimary.light,
//   },
//   color: {
//     "&:hover": {
//       textDecoration: "none",
//     },
//     margin: theme.spacing(0.3),
//     color: "#fff",
//     minHeight: "28px",
//     minWidth: "28px",
//   },
//   brand: {
//     textAlign: "right",
//     width: "55px",
//     "& > img": {
//       maxWidth: "55px",
//     },
//   },
//   btnscart: {
//     marginTop: theme.spacing(0.8),
//     marginBottom: theme.spacing(0.8),
//     //  margin: theme.spacing(0.8),
//     // minWidth: 200,
//   },
// }));

interface ProductForMainProps {
  product: IProductRezult;
  currsymbol: string;
  baseurl: string;
  refDivProduct?: RefObject<HTMLDivElement>;
}

interface ColorItemProps {
  item: TProductLevel1;
}

const ProductForMain: FC<ProductForMainProps> = ({
  product,
  currsymbol,
  baseurl,
  refDivProduct,
}) => {
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

    if (refDivProduct) {
      if (refDivProduct.current) {
        refDivProduct.current.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
    }
  };

  const handleAddCart = (qorder: boolean = false) => {
    const err = cartAddAction(product, qorder);
    if (err) {
      setError(true);
    }
  };

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
        <IconButton {...params} className="productForMain-color" size="small">
          {item.alias === product.current.alias && <DoneIcon />}
        </IconButton>
      );
    };

    return (
      <div className="productForMain-rowinf">
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
            className="productForMain-paramName"
          >
            {product.current.colorItem.title}
          </Typography>
        </div>
        <Typography variant="subtitle1" component="div" color="textSecondary">
          Выберите цвет:
        </Typography>
        {product.level1Arr.map((item) => (
          <ColorItem key={item.alias} item={item} />
        ))}
      </div>
    );
  };

  return (
    <CssRootCard>
      <CardContent>
        <Grid
          container
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="subtitle1" color="textSecondary" component="div">
            {product.gender}
          </Typography>
          <div>
            <Typography
              variant="subtitle1"
              component="span"
              className="productForMain-price"
            >
              {product.price} {currsymbol}
            </Typography>
            {product.old_price > 0 && (
              <Typography
                variant="subtitle2"
                component="span"
                className="productForMain-oldprice"
              >
                {product.old_price} {currsymbol}
              </Typography>
            )}
          </div>
        </Grid>
        <Divider />
        <Typography
          variant="h6"
          component="h1"
          className="productForMain-title"
        >
          {product.title}
        </Typography>
        <Grid
          container
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          className="productForMain-rowinf"
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
                  className="productForMain-paramName"
                >
                  {product.sku}
                </Typography>
              </>
            )}
          </div>
          {product.brandItem && (
            <div className="productForMain-brand">
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
          <div className="productForMain-rowinf">
            <ProductSizeSelector
              level2={product.current.level2}
              alias={product.alias}
              sizesgroup_id={product.sizesgroup_id}
              error={error}
              set_error={setError}
            />
          </div>
        )}
        {/* <StyledEngineProvider injectFirst> */}
        <ThemeProvider theme={themeBtnAddCart}>
          <Button
            variant="contained"
            color="primary"
            className="productForMain-btnscart"
            endIcon={<AddShoppingCartIcon />}
            fullWidth={true}
            onClick={() => handleAddCart(false)}
          >
            В корзину
          </Button>
          <Button
            variant="contained"
            color="secondary"
            className="productForMain-btnscart"
            endIcon={<SendIcon />}
            fullWidth={true}
            onClick={() => handleAddCart(true)}
          >
            Быстрый заказ
          </Button>
        </ThemeProvider>
        {/* </StyledEngineProvider> */}
        <Box mt={3}>
          <Divider />
          <DeliveryRezult
            pvz_selector={true}
            city_name_v={true}
            sel_pvz_v={false}
          />
        </Box>
      </CardContent>
    </CssRootCard>
  );
};

export default ProductForMain;
