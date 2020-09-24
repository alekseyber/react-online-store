import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux'; //, useSelector
import { updateProducts } from '../../redux/actions/products';
import ProductsGrid from '../productsgrid/ProductsGrid';



const Products = ({ products }) => {
    const dispatch = useDispatch();

    const productsTotal = products.length;


    useEffect(() => {
        if (productsTotal) {
            dispatch(updateProducts(products));
        }

    }, [dispatch, products, productsTotal]);


    if (productsTotal === 0) return null



    return (<ProductsGrid products={products} />)

}

Products.propTypes = {
    products: PropTypes.array.isRequired,
};




export default Products;