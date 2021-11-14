import { FC } from "react";
import { styled } from "@mui/material/styles";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import CartNulled from "../../components/cartnulled/CartNulled";
import CartList from "../cartlist/CartList";
import CartSumm from "../../components/cartsumm/CartSumm";
import CartAddCupon from "../../components/cartaddcupon/CartAddCupon";
import AppForm from "../../components/appform/AppForm";
//import LoaderPage from "../../components/loaderpage/LoaderPage";
import ContentSceleton from "../../components/skeletons/ContentSceleton";
import { useQueryApp } from "../../hooks/appolloQueryApp.hook";
import { CART_DATA_QUERY, TPhone, ICartData } from "../../graphql/gqlQuery";
import { useAddOrder } from "../../hooks/addOrder.hook";
import { ICity } from "../../graphql/localVars";

const CssRootGrid = styled(Grid)(({ theme }) => ({
  marginBottom: theme.spacing(3),
}));

// const useStyles = makeStyles((theme) => ({
//   root: {
//     marginBottom: theme.spacing(3),
//   },
// }));

interface CartPageContentProps {
  phone: TPhone;
  currSymbol: string;
  categoryRootLink: string;
  cityDefault: ICity;
}

const CartPageContent: FC<CartPageContentProps> = ({
  phone,
  currSymbol,
  categoryRootLink,
  cityDefault,
}) => {
  const { data } = useQueryApp<ICartData>(CART_DATA_QUERY);
  const cartData = data ? data.cartData : [];

  const { loadingData, handleSubmit } = useAddOrder();

  // if (loadingData) return <LoaderPage />;

  if (loadingData) return <ContentSceleton />;

  if (cartData.length === 0) {
    return <CartNulled categoryRootLink={categoryRootLink} phone={phone} />;
  }

  return (
    <CssRootGrid container spacing={2}>
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
    </CssRootGrid>
  );
};

export default CartPageContent;
