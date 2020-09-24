import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import ProductsGrid from '../productsgrid/ProductsGrid';
import PageContent from '../../components/pagecontent/PageContent';
import { categoryUpdateSort } from '../../redux/actions/category';
import { useFilterProduct } from '../../hooks/filterproduct.hook';
import { removeFilterSelect } from '../../redux/actions/filter';
import { PageBase } from '../../hoc/PageBase';
import { useGetQueryPage } from '../../hooks/router.hook';


const useStyles = makeStyles((theme) => ({
    products: {
        marginTop: theme.spacing(5),
        marginBottom: theme.spacing(5),
    },
    emptyproducts: {
        marginTop: theme.spacing(5),
        marginBottom: theme.spacing(5),
        paddingLeft: theme.spacing(2),
        paddingRight: theme.spacing(2),
        '& > div': {
            marginTop: theme.spacing(2),
            textAlign: "center"
        }

    },
    title: {
        marginTop: theme.spacing(4),
        marginBottom: theme.spacing(2),
        fontWeight: 700
    },
    content: {
        marginTop: theme.spacing(3),
        marginBottom: theme.spacing(5),
    }

}));


const Category = ({ categoryData, alias }) => {


    const classes = useStyles();
    const page = useGetQueryPage();
    const sortValueApp = useSelector(state => state.start.sortData.sortValue);
    const content = categoryData.contData.content;
    const contData = categoryData.contData;
    const products = categoryData.products;
    const sortValue = categoryData.sortValue;
    const { colors, filter, level2 } = categoryData.productsData;
    const productsData = useFilterProduct({ colors, filter, level2, products });
    const productsTotal = productsData.products.length;
    const canonical = `/category/${alias}`;

    const dispatch = useDispatch();

    const handleClear = () => {
        dispatch(removeFilterSelect());
    };

    useEffect(() => {

        if (sortValueApp) {
            if (String(sortValue) !== String(sortValueApp)) {
                dispatch(categoryUpdateSort(alias, sortValueApp));
            }
        }

    }, [dispatch, sortValue, sortValueApp, alias]);

    const bind = {
        name_page: contData.meta_title,
        action_page: contData.meta_description,
        meta_key: contData.meta_keywords,
        link_page: canonical,
        title: contData.htitle,
        filter_on: true,
        meta_full: true,
        canonical_on: true,
        breadcrumbs_add: false,
        filterInputRezult: productsData.filterRezult,
        breadcrumbs_data: contData.breadcrumbs,
        page,

    }

    return (
        <PageBase {...bind}>
            {productsTotal > 0 &&
                <div className={classes.products}>
                    <ProductsGrid
                        products={productsData.products}
                        page={page}
                    />
                </div>}
            {productsTotal === 0 &&
                <div className={classes.emptyproducts}>
                    {productsData.selectedFilter && <>
                        <Typography variant="h6" component="h2" align="center">С учетом текущих критериев фильтрации товаров не найдено.</Typography>
                        <Typography variant="body1" component="p" align="center">Попробуйте изменить критерии для выбора товаров или очистить фильтр.</Typography>
                        <div>
                            <Button
                                variant="outlined"
                                color="primary"
                                onClick={handleClear}
                            >Очистить фильтр</Button>
                        </div>
                    </>}
                    {!productsData.selectedFilter && <>
                        <Typography variant="h6" component="h2" align="center">К сожалению данная категория пока не содержит товаров.</Typography>
                    </>}
                </div>}
            {(page === 1) && <PageContent content={content} />}
        </PageBase>
    )
}


Category.propTypes = {
    categoryData: PropTypes.object.isRequired,
    alias: PropTypes.string.isRequired
};


export default Category;