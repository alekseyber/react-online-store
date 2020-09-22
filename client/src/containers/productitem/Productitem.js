import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import ProductForCatalog from '../../components/productforcatalog/Productforcatalog'
import { useProductDataRender } from '../../hooks/product-data-render.hook';




const ProductItem = ({ alias, colorselect, colors, imgproperty, baseurl, quality, bagdes, currsymbol, related }) => {

    const productData = useSelector(state => state.products[alias]);
    const stateSelectColor = useSelector(state => state.productselect.color[alias]);

    const productDataRender = useProductDataRender({ colorselect, imgproperty, baseurl, quality, bagdes, productData, stateSelectColor });


    if (!productDataRender) {

        return null
    }

 //   if (forcart) return null


    if (related) return (
        <>
            <Typography gutterBottom variant="h6" component="h2">Вам также может понравиться</Typography>
            <ProductForCatalog product={productDataRender} colors={colors} currsymbol={currsymbol} />
        </>
    )


    return (
        <Grid item xs={12} sm={6} md={3}>
            <ProductForCatalog product={productDataRender} colors={colors} currsymbol={currsymbol} />
        </Grid>
    )

}

ProductItem.defaultProps = {
  //  forcart: false,
    currsymbol: "",
    related: false,
};

ProductItem.propTypes = {
    //  item: PropTypes.object.isRequired,
    //  productData: PropTypes.oneOfType([PropTypes.oneOf([undefined]), PropTypes.object]),
    alias: PropTypes.string.isRequired,
    colorselect: PropTypes.oneOfType([PropTypes.oneOf([undefined]), PropTypes.string]),
    colors: PropTypes.object.isRequired,
    //  sizes: PropTypes.object.isRequired,
    bagdes: PropTypes.object.isRequired,
    imgproperty: PropTypes.array.isRequired,
    baseurl: PropTypes.string.isRequired,
    quality: PropTypes.number.isRequired,
    //colorselect: PropTypes.string,
   // forcart: PropTypes.bool,
    related: PropTypes.bool,
    currsymbol: PropTypes.string
};


export default ProductItem;