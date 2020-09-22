import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import ModalBase from '../../../hoc/ModalBase';
import { useHtml } from '../../../hooks/html.hook';

const SizeChartContent = ({ handleClose }) => {

    const sizechart = useSelector(state => state.modaldialog.sizechart);
    const sizechartSelect = useSelector(state => state.modaldialog.sizechartSelect);
    const content = sizechart[sizechartSelect];
    const contentReact = useHtml(content);

    return (
        <ModalBase handleClose={handleClose} title='Размерная сетка'>
            <>{contentReact}</>
        </ModalBase>
    )

}

SizeChartContent.propTypes = {
    handleClose: PropTypes.func.isRequired,
};

export default SizeChartContent;