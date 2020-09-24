import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
//import MetaTags from 'react-meta-tags';
//import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import ProductContetnt from '../../components/productcontent/ProductContetnt';
import ProductItem from '../productitem/ProductItem';
import RecentlyViewed from '../recentlyviewed/RecentlyViewed';
import Breadcrumbs from '../../components/breadcrumbs/Breadcrumbs';
import ProductMainCard from '../productmaincard/ProductMainCard';

import { PageBase } from '../../hoc/PageBase';


const useStyles = makeStyles((theme) => ({
    root: {
        marginTop: theme.spacing(2),
        marginBottom: theme.spacing(5),
    },

}));

const ProductMainPage = ({ productData, color }) => {

    const classes = useStyles();
    const { colorsData, bagdesData, baseUrl } = useSelector(state => state.start);
    const { select, productImgProperty, qualityproductImg, currSymbol } = useSelector(state => state.start.paramsData);

    const meta = useMemo(() => {
        const rezult = {
            title: '',
            description: '',
            keywords: '',
            canonical: ''
        }
        if (productData.mainData) {
            let addColor = '';

            if (color) {
                if (color !== productData.color_default) {
                    addColor = `?color=${color}`;
                }
            }

            rezult.title = productData.mainData.meta.title;
            rezult.description = productData.mainData.meta.description;
            rezult.keywords = productData.mainData.meta.keywords;
            rezult.canonical = `/product/${productData.alias}${addColor}`;
        }

        return rezult;
    }, [productData, color]);


    const contetntData = useMemo(() => {

        const rezult = {
            content: '',
            cartpr1: [],
            cartpr2: [],
        }

        if (productData.mainData) {

            rezult.content = productData.mainData.content;
            rezult.cartpr1 = productData.mainData.filter.cartpr1;
            rezult.cartpr2 = productData.mainData.filter.cartpr2;

        }

        return rezult;
    }, [productData]);

    const { related, breadcrumbsData } = useMemo(() => {

        const rezult = {
            related: false,
            breadcrumbsData: []
        }
        if (productData.mainData) {

            if (productData.mainData.related.length) {
                rezult.related = productData.mainData.related;
            }
            rezult.breadcrumbsData = productData.mainData.breadcrumbsparrent;
        }

        return rezult

    }, [productData]);


    const bind = {
        name_page: meta.title,
        action_page: meta.description,
        meta_key: meta.keywords,
        link_page: meta.canonical,
        filter_on: false,
        meta_full: true,
        canonical_on: true,
        breadcrumbs_on: false
    }


    return (
        <PageBase {...bind}>
            {/* <MetaTags>
                <title>{meta.title}</title>
                <meta name="description" content={meta.description} />
                <meta name="keywords" content={meta.keywords} />
                <meta property="og:title" content={meta.title} />
                <link rel="canonical" href={meta.canonical} />                
            </MetaTags>
            <Container fixed> */}
            <div className={classes.root}>
                <ProductMainCard
                    colors={colorsData.colors}
                    imgproperty={productImgProperty}
                    baseurl={baseUrl}
                    quality={qualityproductImg}
                    bagdes={bagdesData}
                    currsymbol={currSymbol}
                    productData={productData}
                />
                <Breadcrumbs breadcrumbsData={breadcrumbsData} />
                <Grid
                    container
                    spacing={2}
                >
                    <Grid item xs={12} md={8}>
                        <ProductContetnt productContetntData={contetntData} />
                    </Grid>
                    {related && select && <Grid item xs={12} md={4}>
                        <ProductItem
                            alias={related}
                            colors={colorsData.colors}
                            imgproperty={productImgProperty}
                            baseurl={baseUrl}
                            quality={qualityproductImg}
                            bagdes={bagdesData}
                            currsymbol={currSymbol}
                            related={true}
                        />
                    </Grid>}
                </Grid>
                <RecentlyViewed
                    alias={productData.alias}
                    colors={colorsData.colors}
                    imgproperty={productImgProperty}
                    baseurl={baseUrl}
                    quality={qualityproductImg}
                    bagdes={bagdesData}
                    currsymbol={currSymbol}
                />
            </div>
            {/* </Container> */}

        </PageBase>
    )
}



ProductMainPage.propTypes = {
    color: PropTypes.oneOfType([PropTypes.oneOf([undefined]), PropTypes.string]),
    productData: PropTypes.object.isRequired
};


export default ProductMainPage;