import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { PageBase } from '../../hoc/PageBase';
import { useRouter } from '../../hooks/router.hook';
import LoaderPage from '../../components/loaderpage/Loader';
import { cartAddPageAction } from '../../redux/actions/cart';


export default () => {

    const { params } = useRouter();
    const dispatch = useDispatch();

    const id = params.id;

    useEffect(() => {

        dispatch(cartAddPageAction(id));

        //  return () => {}

    }, [id, dispatch]);


    // eslint-disable-next-line


    const bind = {
        name_page: 'Добавление товара в корзину',
        action_page: 'Добавление в корзину',
        link_page: "/addcard",
        title: 'Добавление товара в корзину',
        filter_on: false,
    }

    return (
        <PageBase {...bind}>
            <LoaderPage />
        </PageBase>
    )
}