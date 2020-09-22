import React, { useState, useEffect, useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import { useHttp } from '../../hooks/http.hook';
import ProductsGrid from '../../containers/productsgrid/Productsgrid';
import { updateProducts } from '../../redux/actions/products';
import LoaderContent from '../../components/loadercontent/Loadercontent';

const useStyles = makeStyles({
    root: {
        minHeight: '30vh',
    },
    loader: {
        display: 'flex',
        justifyContent: 'center'
    }
});



const Search = ({ q }) => {

    const classes = useStyles();

    const dispatch = useDispatch();
    const { requestNoErrMsg } = useHttp(dispatch);
    const requestNoErrMsgMemo = useCallback(requestNoErrMsg, []);

    const productsData = useSelector(state => state.products);

    const initial = {
        loader: true,
        list: [],
        color: []
    }
    const [rezult, setRezult] = useState(initial);

    const { loader, list, color } = rezult;


    useEffect(() => {
        setRezult({
            loader: true,
            list: [],
            color: []
        });

    }, [q]);

    useEffect(() => {

        const fetchData = async () => {

            const rez = {
                loader: false,
                list: [],
                color: []
            }
            try {

                if (q.length) {
                    const { products, filter } = await requestNoErrMsgMemo('/api/search/full', 'get', { q });
                    rez.list = products;

                    if (products.length) {
                        await dispatch(updateProducts(products));
                        if (filter.count && filter.selected) {
                            rez.color = filter.selected.color ?? [];
                        }
                    }
                }

            } catch (e) {
                console.error(e);

            } finally {
                setRezult(rez);
            }
        }
        fetchData();
       
    }, [q, requestNoErrMsgMemo, dispatch]);

    const productList = useMemo(() => {

        if (list.length === 0) {
            return list
        }

        if (color.length) {
            const productsColor = [];
            list.forEach(item => {
                if (item.alias in productsData) {
                    const ptoductItem = productsData[item.alias];
                    color.forEach(itemcolor => {
                        if (itemcolor in ptoductItem.level1) {
                            const product = {
                                alias: item.alias,
                                colorselect: itemcolor
                            }
                            productsColor.push(product);
                        }
                    });
                }

            });

            return productsColor
        } else {
            return list
        }

    }, [list, color, productsData]);


    return (

        <>
            {(productList.length === 0) && <Card className={classes.root}>
                <CardContent>
                    {loader && <LoaderContent text="Поиск на сервере..." />}
                    {!loader && (
                        <>
                            <Typography variant="h6" component="h2" align="center" gutterBottom>По данному запросу результатов не найдено.</Typography>
                            <Typography variant="body1" component="p" align="center">Попробуйте изменить поисковую фразу.</Typography>
                        </>
                    )}
                </CardContent>
            </Card>}
            {(productList.length > 0) && <ProductsGrid products={productList} />}
        </>

    )
}

Search.propTypes = {
    q: PropTypes.string.isRequired,
};

export default Search;