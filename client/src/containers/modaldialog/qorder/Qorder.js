import React from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import AppForm from '../../../components/appform/Appform';
import ModalBase from '../../../hoc/ModalBase';
import { sendOrder } from '../../../redux/actions/order';

const QOrder = ({ handleClose }) => {

    const dispatch = useDispatch();

    const handleSubmit = data => {
        dispatch(sendOrder(data, true));
    }

    return (

        <ModalBase handleClose={handleClose} title='Быстрый заказ' actionsBtnText='Продолжить покупки'>
            <AppForm handleInputSubmit={handleSubmit} fullOrder={false} />
        </ModalBase>
    )

}

QOrder.propTypes = {
    handleClose: PropTypes.func.isRequired,
};

export default QOrder;