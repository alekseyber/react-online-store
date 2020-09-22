import React from 'react';
import { Link } from "react-router-dom";
import { useSelector } from 'react-redux';
import Button from '@material-ui/core/Button';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Popover from '@material-ui/core/Popover';
import Typography from '@material-ui/core/Typography';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import Badge from '@material-ui/core/Badge';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';
import CartList from '../../cartlist/Cartlist';


const MenuButton = withStyles(() => ({
    root: {
        fontWeight: 700,
        padding: "0 16px",
        fontSize: ".875rem",
        minWidth: "64px",
        minHeight: "100%"

    },
}))(Button);



const useStyles = makeStyles((theme) => ({
    root: {
        '& .MuiBadge-root > span': {
            marginLeft: theme.spacing(-1.5),
            color: "#fff"
        },
    },

}));




const SmallCart = () => {

    const classes = useStyles();
    const [anchorEl, setAnchorEl] = React.useState(null);
    const cartData = useSelector(state => state.cart.cartData);
    const count = cartData.length;


    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    const id = open ? 'cart-popover' : undefined;



    return (
        <div className={classes.root}>
            <MenuButton size="medium" aria-describedby={id} color="inherit" onClick={handleClick}>
                {count > 0 && <Badge
                    color="secondary"
                    badgeContent={count}
                    anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'left',
                    }}
                >
                    <ShoppingCartIcon />
                </Badge>}
                {count === 0 && <ShoppingCartIcon />}
            </MenuButton>
            <Popover
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                }}
            >
                {count === 0 && <Box p={2}>
                    <Typography>К сожалению, на данный момент</Typography>
                    <Typography>Ваша корзина пуста</Typography>
                </Box>}
                {count > 0 && <>
                    <CartList handleClose={handleClose} />
                    <Divider />
                    <Box p={2}>
                        <Grid
                            container
                            direction="row"
                            justify="center"
                            alignItems="center"
                        >
                            <Button variant="contained" color="primary" component={Link} to='/cart' onClick={handleClose}>Оформить заказ</Button>
                        </Grid>
                    </Box>
                </>}
            </Popover>
        </div>
    );
}

export default SmallCart;