import React from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import Typography from '@material-ui/core/Typography';
import AppForm from '../../../components/appform/Appform';
import ModalBase from '../../../hoc/ModalBase';
import { sendReturnCall } from '../../../redux/actions/order';

const ReturnCall = ({ handleClose }) => {

    const dispatch = useDispatch();
    const returnCallStatus = useSelector(state => state.order.returnCallStatus);

    const handleSubmit = data => {
        dispatch(sendReturnCall(data));
    }

    return (

        <ModalBase handleClose={handleClose} title='Задать вопрос или заказать звонок' actionsBtnText='Продолжить покупки'>
            <>
                {!returnCallStatus && <AppForm handleInputSubmit={handleSubmit} fullOrder={false} btnText="Отправить" reOn={true} />}
                {returnCallStatus && (
                    <>
                        <Typography variant="h6" component="h2" gutterBottom>Ваша заявка успешно получена.</Typography>
                        <Typography variant="body1" component="p">Благодарим Вас за обращение на нашем сайте. В ближайшее время с Вами свяжется менеджер.</Typography>
                    </>
                )}
            </>
        </ModalBase>
    )

}

ReturnCall.propTypes = {
    handleClose: PropTypes.func.isRequired,
};

export default ReturnCall;