import React, { useEffect, useMemo } from 'react';
//import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { mainProductFetch } from '../../redux/actions/products';
import LoaderPage from '../../components/loaderpage/Loader';
//import { history } from '../../redux/store';
import { setColorProductAction } from '../../redux/actions/productselect';
import ProductMainPage from '../../containers/productmainpage/Productmainpage';
import { useRouter } from '../../hooks/router.hook';


export default () => {
    const { replace, query, params } = useRouter();

    const { alias } = params;
    const { colors } = query;

    //  const { alias } = useParams();
    //const { colors } = useQuery();

    const productData = useSelector(state => state.products[alias]);

    const loader = useMemo(() => {
        if (!productData) {
            return true
        }
        if (!productData.mainData) {
            return true
        }
    }, [productData]);



    const dispatch = useDispatch();


    useEffect(() => {
        dispatch(mainProductFetch(alias));
    }, [dispatch, alias]);

    useEffect(() => {
        if (!loader && colors) {
            const level1 = productData.mainData.level1;
            if (colors in level1) {
                dispatch(setColorProductAction({
                    alias, color: colors
                }));
            } else {
                replace('/404');
            }

        }
    }, [dispatch, productData, colors, loader, alias, replace]);




    if (loader) return <LoaderPage />

    return <ProductMainPage productData={productData} color={colors} />


}