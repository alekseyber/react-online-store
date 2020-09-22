import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import ProductItem from '../productitem/Productitem';
import { PaginationList, usePagin } from '../../hoc/Paginationlist';


const ProductsGrid = ({ products, page }) => {


    const { colorsData, bagdesData, baseUrl } = useSelector(state => state.start);
    // const sizesData = useSelector(state => state.start.sizesData);    
    const { select, productImgProperty, qualityproductImg, currSymbol, count_page_product } = useSelector(state => state.start.paramsData);

    if (!select || !colorsData) {
        return null;
    }

    const ListProduct = () => {
        const paginationRezult = usePagin();

        return (
            <>
                {paginationRezult.map((item, index) => (
                    <ProductItem
                        alias={item.alias}
                        colorselect={item.colorselect}
                        colors={colorsData.colors}
                        // sizes={sizesData}
                        imgproperty={productImgProperty}
                        baseurl={baseUrl}
                        quality={qualityproductImg}
                        bagdes={bagdesData}
                        currsymbol={currSymbol}
                        key={index}
                    />
                ))
                }
            </>
        )
    }


    const paginBind = {
        count_page: count_page_product,
        page,
        input_list: products,
        spacing_grid: 2
    }


    return (

        <PaginationList {...paginBind}>
            <ListProduct />
        </PaginationList>
    )

}

ProductsGrid.defaultProps = {
    products: [],
    page: 1,    
};



ProductsGrid.propTypes = {
    products: PropTypes.array,
    page: PropTypes.number,    
};

export default ProductsGrid;