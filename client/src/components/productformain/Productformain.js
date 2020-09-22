import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { makeStyles, createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import DoneIcon from '@material-ui/icons/Done';
import SendIcon from '@material-ui/icons/Send';
import AddShoppingCartIcon from '@material-ui/icons/AddShoppingCart';
import Divider from '@material-ui/core/Divider';
import Box from '@material-ui/core/Box';
import { green } from '@material-ui/core/colors';
import { setColorProductAction } from '../../redux/actions/productselect';
import { cartAddAction } from '../../redux/actions/cart';
import ProductSizeSelector from '../productsizeselector/Productsizeselector';
import DeliveryRezult from '../../containers/deliveryrezult/Deliveryrezult';

const useStyles = makeStyles((theme) => ({
    rowinf: {
        marginTop: theme.spacing(2),
        marginBottom: theme.spacing(2),
        // flexWrap: "wrap",
    },
    title: {
        fontWeight: 700,
        padding: `${theme.spacing(1)}px 0`
    },
    price: {
        fontWeight: 700,
    },
    oldrice: {
        fontWeight: 700,
        marginLeft: theme.spacing(1),
        textDecoration: "line-through"
    },
    color: {
        "&:hover": {
            textDecoration: "none"
        },
        margin: theme.spacing(0.3),
        color: "#fff",
        minHeight: "28px",
        minWidth: "28px"
    },
    brand: {
        textAlign: "right",
        width: "55px",
        "& > img": {
            maxWidth: "55px"
        }
    },
    btnscart: {
        marginTop: theme.spacing(.8),
        marginBottom: theme.spacing(.8),
        // minWidth: 200,
        //  width: '100%'
    }

}));

const theme = createMuiTheme({
    palette: {
        primary: {

            main: green[500],
            contrastText: '#fff'
        }
    },
});

const ProductForMain = ({ product, colors, currsymbol, baseurl }) => {
    const classes = useStyles();
    const brand = useSelector(state => state.start.brandsData[product.brand_id]);

    const [error, setError] = useState(false);

    useEffect(() => {

        setError(false)

    }, [product])
    //  const history = useHistory();
    const dispatch = useDispatch();

    const sizeSelectVisible = (product.product_model === 1 || product.product_model === 4);

    const preventDefault = (event) => {
        event.preventDefault();
        event.stopPropagation();
    };

    const handleColor = (event, color) => {
        preventDefault(event);
        dispatch(setColorProductAction({ alias: product.alias, color }));
    };

    const handleAddCart = (qorder = false) => {

        const err = dispatch(cartAddAction(product, qorder));
        if (err) {
            setError(true)
        }
    };


    const Colorlevel = () => {

        if (product.product_model > 2) return null;

        const ColorItem = ({ calias }) => {

            const href = (product.color_default !== calias) ? `${product.link}?colors=${calias}` : product.link;
            const style = {
                backgroundColor: '#' + colors[calias].colorkey,

            };
            const onClick = ev => handleColor(ev, calias);
            const params = { href, style, onClick };

            return <IconButton {...params} className={classes.color} size="small" >
                {(calias === product.select_color) && <DoneIcon />}
            </IconButton>
        }

        return (
            <div className={classes.rowinf}>
                <div>
                    <Typography variant="subtitle1" component="span" color="textSecondary">Текущий цвет:</Typography>
                    <Typography variant="subtitle1" component="span" className="ml-1 text-uppercase font-weight-black">
                        {colors[product.select_color].title}
                    </Typography>
                </div>
                <Typography variant="subtitle1" component="div" color="textSecondary">Выберите цвет:</Typography>
                {Object.keys(product.level1).map((calias, index) => (
                    <ColorItem key={index} calias={calias} />
                ))
                }
            </div>
        )
    }


    return (

        <Card className={classes.root} >
            <CardContent>
                <Grid
                    container
                    direction="row"
                    justify="space-between"
                    alignItems="center"
                >
                    <Typography variant="subtitle1" color="textSecondary" component="div" >
                        {product.gender}
                    </Typography>
                    <div>
                        <Typography variant="subtitle1" color="secondary" component="span" className={classes.price}>
                            {product.price} {currsymbol}
                        </Typography>
                        {product.old_price > 0 && <Typography variant="subtitle2" color="textSecondary" component="span" className={classes.oldrice}>
                            {product.old_price} {currsymbol}
                        </Typography>}
                    </div>
                </Grid>
                <Divider />
                <Typography variant="h6" component="h1" className={classes.title} >
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
                        {product.sku.length > 0 && (
                            <>
                                <Typography variant="subtitle1" component="span" color="textSecondary">Модель:</Typography>
                                <Typography variant="subtitle1" component="span" className="ml-1 text-uppercase font-weight-black">
                                    {product.sku}
                                </Typography>
                            </>
                        )}
                    </div>
                    {brand && (
                        <div className={classes.brand}>
                            <img src={baseurl + brand.img} alt={brand.title} />
                        </div>
                    )}
                </Grid>
                <Colorlevel />
                {sizeSelectVisible && <div className={classes.rowinf}>
                    <ProductSizeSelector
                        level2={product.select_level2}
                        alias={product.alias}
                        sizesgroup_id={product.sizesgroup_id}
                        error={error}
                        set_error={setError}
                    />
                </div>}
                <ThemeProvider theme={theme}>
                    <Button
                        variant="contained"
                        color="primary"
                        className={classes.btnscart}
                        endIcon={<AddShoppingCartIcon />}
                        fullWidth={true}
                        onClick={() => handleAddCart(false)}
                    >В корзину</Button>
                </ThemeProvider>
                <Button
                    variant="contained"
                    color="secondary"
                    className={classes.btnscart}
                    endIcon={<SendIcon />}
                    fullWidth={true}
                    onClick={() => handleAddCart(true)}
                >Быстрый заказ</Button>
                <Box mt={3}>
                    <Divider />
                    <DeliveryRezult pvz_selector={true} city_name_v={true} sel_pvz_v={false} />
                </Box>
            </CardContent>
        </Card>

    )
}


ProductForMain.defaultProps = {
    currsymbol: "",
    baseurl: ""
};


ProductForMain.propTypes = {
    product: PropTypes.object.isRequired,
    colors: PropTypes.object.isRequired,
    currsymbol: PropTypes.string,
    baseurl: PropTypes.string,
};


export default ProductForMain;