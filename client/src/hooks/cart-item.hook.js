import { useMemo } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';



const useItemCartData = ({ itemcart, imgproperty, baseurl, full }) => {

    const alias = itemcart.alias;
    const level1 = itemcart.level1;
    const level2 = itemcart.level2;

    const productData = useSelector(state => state.products[alias]);

    const product = useMemo(() => {
        if (!productData) {
            return null
        }
        const sizeSelectTrue = (productData.product_model === 1 || productData.product_model === 4);

        const item = {
            gender: productData.gender,
            title: productData.title,
            img: baseurl + imgproperty[0].path + productData.level1[level1].img,
            old_price: productData.old_price,
            level1,
            level2: sizeSelectTrue ? true : null,
            alias: productData.alias,
            level1_cart: level1
        }
        if (productData.level1[level1].old_price) {
            item.old_price = productData.level1[level1].old_price
        }


        if (productData.product_model > 2) {
            item.level1 = null;
        }
        item.levels1 = [];
        item.levels2 = [];


        if (full && sizeSelectTrue) {
            item.levels2 = productData.level1[level1].level2;
        }


        return item;

    }, [productData, level1, imgproperty, baseurl, full]);


    const productRezult = useMemo(() => {
        if (!product) {
            return product
        }

        const newProduct = { ...product };

        if (product.level2) {
            newProduct.level2 = level2;
        }
        newProduct.level2_cart = level2;
        
        if (newProduct.level1 && full) {
            newProduct.levels1 = Object.keys(productData.level1).filter(el => (productData.level1[el].level2.findIndex(iEl => iEl === level2) > -1));
        }

        return newProduct

    }, [productData, product, level2, full]);

    if (productRezult) {
        productRezult.price = itemcart.price;
        productRezult.summ = itemcart.price * itemcart.qty;
        productRezult.qty = itemcart.qty;
    }


    return productRezult

}

useItemCartData.defaultProps = {
    baseurl: "",
    full: false
};

useItemCartData.propTypes = {

    itemcart: PropTypes.object.isRequired,
    imgproperty: PropTypes.array.isRequired,
    baseurl: PropTypes.string,
    full: PropTypes.bool
};


export { useItemCartData };