import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import ModalBase from '../../../hoc/ModalBase';
import { useHtml } from '../../../hooks/html.hook';

const OfertaContentModal = ({ handleClose }) => {

    const ofertaContent = useSelector(state => state.modaldialog.ofertaContent);
    const contentReact = useHtml(ofertaContent);

    return (
        <ModalBase handleClose={handleClose} title='Публичная оферта'>
            <>{contentReact}</>
        </ModalBase>
    )

}

OfertaContentModal.propTypes = {
    handleClose: PropTypes.func.isRequired,
};

export default OfertaContentModal;