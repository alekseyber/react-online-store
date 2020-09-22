import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { PageBase } from '../../hoc/PageBase';
import { useRouter } from '../../hooks/router.hook';
import { useHttp } from '../../hooks/http.hook';
import OrderInfPage from '../../components/orderinfpage/Orderinfpage';
import LoaderPage from '../../components/loaderpage/Loader';



export default () => {

    const [data, setData] = useState(null);
    const { params } = useRouter();
    const { requestRedirect } = useHttp(useDispatch());
    const requestRedirectMemo = useCallback(requestRedirect, []);
    const id = params.id;

    useEffect(() => {

        const fetchData = async () => {
            try {
                const order = await requestRedirectMemo(`/api/order/${id}`);
                setData(order);
            } catch (e) {
                console.error(e);
            }
        }
        fetchData();

        return () => {
            setData(null);
        }
       
    }, [id, requestRedirectMemo]);

    if (!data) return <LoaderPage />


    const bind = {
        name_page: `Заказ № ${data.orderNum}`,
        action_page: `Заказ № ${data.orderNum}`,
        link_page: "/order",
        title: `Заказ № ${data.orderNum}.`,
        filter_on: true,
    }

    return (
        <PageBase {...bind}>
            <OrderInfPage data={data} />
        </PageBase>
    )
}