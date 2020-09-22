import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { useHistory } from "react-router-dom";
import Button from '@material-ui/core/Button';
import AddedCartComponent from '../../../components/addedcart/Addedcart';
import ModalBase from '../../../hoc/ModalBase';


const AddedCart = ({ handleClose }) => {

    const history = useHistory();

    const lastCart = useSelector(state => state.cart.lastCart);

    const handleOpenOrder = () => {
        history.push('/cart');
        handleClose();
    }


    const actionsNode = (
        <>
            <Button onClick={handleClose} variant="outlined" color="primary">Продолжить покупки</Button>
            <Button onClick={handleOpenOrder} variant="contained" color="primary">Оформить заказ</Button>
        </>
    )




    return (

        <ModalBase handleClose={handleClose} title='Добавлено в корзину' actionsNode={actionsNode}>
            <AddedCartComponent lastCart={lastCart} />
        </ModalBase>
    )

}

AddedCart.propTypes = {
    handleClose: PropTypes.func.isRequired,
};

export default AddedCart;