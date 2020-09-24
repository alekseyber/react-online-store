import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Card from '@material-ui/core/Card';
import PhoneIcon from '@material-ui/icons/Phone';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import { PageBase } from '../../hoc/PageBase';
import { textReturnProductFetch } from '../../redux/actions/start';
import { sendReturnProduct } from '../../redux/actions/order';
import { useHtml } from '../../hooks/html.hook';
import AppForm from '../../components/appform/AppForm';



export default () => {
    
    const { phone } = useSelector(state => state.start.paramsData);
    const textReturnProduct = useSelector(state => state.start.textReturnProduct);
    const { returnProductStatus, returnProductAction } = useSelector(state => state.order);
    const contentReact = useHtml(textReturnProduct);
    const dispatch = useDispatch();

    const handleInputSubmit = data => {
        dispatch(sendReturnProduct(data));
    }

    useEffect(() => {
        dispatch(textReturnProductFetch());
    }, [dispatch])

    const bind = {
        name_page: 'Возврат/обмен',
        action_page: 'Отправить заявку на возврат/обмен',
        link_page: "/returnproduct",
        title: 'Отправить заявку на возврат/обмен',
        filter_on: true,
    }
    const bindForm = {
        handleInputSubmit,
        ofertaOn: false,
        commentOn: false,
        btnText: 'Отправить заявку',
        returnproduct: true,
        fullOrder: false,
        reOn: true
    }


    return (
        <PageBase {...bind}>
            <Card>
                <CardContent>
                    {returnProductStatus && (
                        <>
                            <Typography variant="h6" component="h2">
                                Ваша заявка на {returnProductAction} успешно получена.
                        </Typography>
                            <Typography variant="body1" component="p" gutterBottom>
                                Благодарим Вас за обращение на нашем сайте. В ближайшее время с Вами свяжется менеджер для уточнения деталей.
                            </Typography>
                        </>
                    )}
                    {!returnProductStatus && <AppForm {...bindForm} />}
                    <Divider className="mt-2" />
                    {contentReact}
                    <Typography variant="body1" component="p">
                        Для оформления заказа, просим заполнить форму, размещенную выше, либо позвонить по телефону: <Button startIcon={<PhoneIcon />} className="ml-1" href={'tel:' + phone.href}>{phone.title}</Button>
                    </Typography>
                </CardContent>
            </Card>
        </PageBase >
    )
}