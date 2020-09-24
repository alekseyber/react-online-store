import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { useSelector } from 'react-redux';
import List from '@material-ui/core/List';
import CartItem from '../cartitem/CartItem';

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        // maxWidth: '320px',
        backgroundColor: theme.palette.background.paper,
       
    },
    inline: {
        display: 'inline',
    },
}));



const CartList = ({ full, handleClose }) => {
    const classes = useStyles();
    const cartData = useSelector(state => state.cart.cartData);
    const { productImgProperty, currSymbol } = useSelector(state => state.start.paramsData);
    const { baseUrl, colorsData, sizesData } = useSelector(state => state.start);
    const count = cartData.length;
    const colors = colorsData.colors;


    return (
        <List className={classes.root}>
            {cartData.map((itemcart, index) => (
                <CartItem
                    itemcart={itemcart}
                    key={index}
                    divider_on={(count - 1) !== index}
                    imgproperty={productImgProperty}
                    currsymbol={currSymbol}
                    baseurl={baseUrl}
                    colors={colors}
                    sizes={sizesData}
                    index={index}
                    full={full}
                    handleClose={handleClose}
                />
            ))}
        </List>
    );
}


CartList.defaultProps = {
    full: false
};

CartList.propTypes = {
    handleClose: PropTypes.oneOfType([PropTypes.oneOf([undefined]), PropTypes.func]),    
    full: PropTypes.bool,
};



export default CartList;