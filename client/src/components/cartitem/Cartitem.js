import React from 'react';
import { createMuiTheme, ThemeProvider, makeStyles } from '@material-ui/core/styles'; //makeStyles, 
import { useHistory } from "react-router-dom";
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import LinkUi from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import { red } from '@material-ui/core/colors';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import { useItemCartData } from '../../hooks/cart-item.hook';
import { cartDeleteItem, cartChangeItemCount } from '../../redux/actions/cart';
import { setColorAndSizeProduct } from '../../redux/actions/productselect';
import SizeSelector from "./sizeselector/SizeSelector";
import ColorSelector from "./colorselector/ColorSelector";

const useStyles = makeStyles(theme => ({

    avatar: {
        width: 65,
        height: 65,
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
        }
    },
});

const CartItem = ({ index, itemcart, imgproperty, baseurl, currsymbol, divider_on, colors, sizes, handleClose, full }) => {
    const classes = useStyles();
    const history = useHistory();
    const dispatch = useDispatch();
    const item = useItemCartData({ itemcart, imgproperty, baseurl, full });
    const productLink = `/product/${item.alias}`;


    const handleOpenProduct = event => {
        event.preventDefault();
        event.stopPropagation();
        dispatch(setColorAndSizeProduct(item.alias, item.level1, item.level2));
        history.push(productLink);
        if (handleClose) {
            handleClose();
        }

    }
    const handleDeletItem = () => {
        dispatch(cartDeleteItem(index));
    }

    const handleChangeQty = (event) => {
        dispatch(cartChangeItemCount(index, event.target.value));
    };

    const FullElement = () => {
        if (!full) {
            return null
        }

        //    Array.apply(null, { length: N }).map((_, val) => ( 

        const N = (item.qty <= 5) ? 5 : item.qty;

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
                            value={item.qty}
                            onChange={handleChangeQty}
                        >
                            {new Array(N).fill('').map((_, val) => (
                                <MenuItem key={val} value={(val + 1)} dense={true}>{(val + 1)}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <div>
                        <Typography variant="body2" component="span" color="textSecondary">Сумма:</Typography>
                        <Typography variant="body2" component="span" color="textPrimary" className="ml-1">
                            {item.summ} {currsymbol}
                        </Typography>
                    </div>
                </Grid>
                {item.levels1.length > 0 && <Box mt={1} mb={1}>
                    <ColorSelector index={index} levels1={item.levels1} level1_cart={item.level1_cart} level2_cart={item.level2_cart} colors={colors} />
                </Box>}
                {item.levels2.length > 0 && <Box mt={1} mb={1}>
                    <SizeSelector index={index} levels2={item.levels2} level2_cart={item.level2_cart} sizes={sizes} />
                </Box>}
            </>

        )
    }


    const primaryEl = (
        <div className="mb-1">
            <LinkUi
                variant="body2"
                className="font-weight-black"
                href={productLink}
                onClick={handleOpenProduct}
            >{item.title} {item.gender}</LinkUi>
        </div>
    );
    const secondaryEl = (
        <div>
            <div>
                {item.level1 && (
                    <>
                        <Typography variant="body2" component="span" color="textSecondary">Цвет:</Typography>
                        <Typography variant="body2" component="span" color="textPrimary" className="ml-1 mr-1 text-uppercase">
                            {colors[item.level1].title}
                        </Typography>
                    </>
                )}
                {item.level2 && (
                    <>
                        <Typography variant="body2" component="span" color="textSecondary">Размер:</Typography>
                        <Typography variant="body2" component="span" color="textPrimary" className="ml-1 mr-1">
                            {sizes[item.level2].title}
                        </Typography>
                    </>
                )}
            </div>
            <div>
                <Typography variant="body2" component="span" color="textSecondary">Цена:</Typography>
                <Typography variant="body2" color="secondary" component="span" className="font-weight-black ml-1">
                    {item.price} {currsymbol}
                </Typography>
                {item.old_price > 0 && <Typography variant="body2" color="textSecondary" component="span" className="oldrice ml-1">
                    {item.old_price} {currsymbol}
                </Typography>}
            </div>
            <FullElement />
        </div>
    );


    return (

        <>
            <ListItem alignItems="flex-start">
                <ListItemAvatar>
                    <Avatar alt={item.title} src={item.img} className={classes.avatar} variant="square" />
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
}


CartItem.defaultProps = {
    currsymbol: "",
    baseurl: "",
    divider_on: true,
    full: false
};

CartItem.propTypes = {
    index: PropTypes.number.isRequired,
    itemcart: PropTypes.object.isRequired,
    imgproperty: PropTypes.array.isRequired,
    baseurl: PropTypes.string,
    currsymbol: PropTypes.string,
    divider_on: PropTypes.bool,
    colors: PropTypes.object.isRequired,
    sizes: PropTypes.object.isRequired,
    handleClose: PropTypes.func,
    full: PropTypes.bool,
};


export default CartItem;