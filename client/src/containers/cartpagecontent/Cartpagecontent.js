import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import CartNulled from "../../components/cartnulled/Cartnulled";
import CartList from "../../components/cartlist/Cartlist";
import CartSumm from "../../components/cartsumm/Cartsumm";
import CartAddCupon from "../../components/cartaddcupon/Cartaddcupon";
import AppForm from "../../components/appform/Appform";
import { sendOrder } from '../../redux/actions/order';



const useStyles = makeStyles((theme) => ({
    root: {
        marginBottom: theme.spacing(3),
    },


}));

const CartPageContent = () => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const cartData = useSelector(state => state.cart.cartData);

    const handleSubmit = data => {
        dispatch(sendOrder(data));
    }

    if (cartData.length === 0) {
        return <CartNulled />
    }



    return (
        <Grid
            container
            spacing={2}
            className={classes.root}
        >
            <Grid item xs={12} md={6}>
                <Typography variant="h5" component="h1">Оформить заказ</Typography>
                <Divider />
                <Typography variant="caption" component="div" color="textSecondary" className="mt-1">Контактная информация</Typography>
                <AppForm handleInputSubmit={handleSubmit} />
            </Grid>
            <Grid item xs={12} md={6}>
                <Typography variant="h6" component="h2">Состав заказа</Typography>
                <Divider />
                <CartList full={true} />
                <CartAddCupon />
                <CartSumm />
            </Grid>
        </Grid>
    )
}

export default CartPageContent;