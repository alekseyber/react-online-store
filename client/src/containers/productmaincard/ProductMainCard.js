import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import Grid from '@material-ui/core/Grid';
import { useProductDataRender } from '../../hooks/product-data-render.hook';
import ProductImgCarusel from '../../components/productimgcarusel/ProductImgCarusel';
import ProductForMain from '../../components/productformain/ProductForMain';



const ProductMainCard = ({ productData, colors, imgproperty, baseurl, quality, bagdes, currsymbol }) => {

    const stateSelectColor = useSelector(state => state.productselect.color[productData.alias]);
    const main = true;
    const productDataRender = useProductDataRender({ imgproperty, baseurl, quality, bagdes, productData, stateSelectColor, main });

    if (!productDataRender) {
        return null
    }

    return (

        <Grid
            container
            spacing={2}
        >
            <Grid item xs={12} md={8} lg={7}>
                <ProductImgCarusel gal={productDataRender.gal} title={productDataRender.title} />
            </Grid>
            <Grid item xs={12} md={4} lg={5}>
                <ProductForMain product={productDataRender} colors={colors} currsymbol={currsymbol} baseurl={baseurl} />
            </Grid>
        </Grid>

    )

}


ProductMainCard.defaultProps = {
    currsymbol: "",
};

ProductMainCard.propTypes = {
    productData: PropTypes.object.isRequired,
    colors: PropTypes.object.isRequired,
    bagdes: PropTypes.object.isRequired,
    imgproperty: PropTypes.array.isRequired,
    baseurl: PropTypes.string.isRequired,
    quality: PropTypes.number.isRequired,
    currsymbol: PropTypes.string
};


export default ProductMainCard;