import React from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux'
import Box from '@material-ui/core/Box';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import { setDelivery } from '../../redux/actions/delivery';



const DeliverySelector = ({ pvz_price, courier_price, currSymbol, deliverySelect }) => {
    const arrParams = [`Курьер - ${courier_price} ${currSymbol}`, `ПВЗ - ${pvz_price} ${currSymbol}`];

    const dispatch = useDispatch();

    const handleChange = (event) => {
        const val = parseInt(event.target.value, 10);
        if (val === 0 || val === 1) {
           
            if (deliverySelect !== val) {
                dispatch(setDelivery({ deliverySelect: val }));
            }
        }

    };

    return (

        <Box mt={.5} mb={.5}>
            <FormControl component="fieldset">
                <FormLabel component="legend">Тип доставки</FormLabel>
                <RadioGroup name="deliverySelect" value={deliverySelect} onChange={handleChange}>
                    {
                        arrParams.map((item, i) => (
                            <FormControlLabel value={i} control={<Radio />} label={item} key={i} />
                        ))
                    }
                </RadioGroup>
            </FormControl>
        </Box >

    )
}

DeliverySelector.defaultProps = {
    currSymbol: '',
    pvz_price: 0,
    courier_price: 0,
    deliverySelect: 0
};

DeliverySelector.propTypes = {
    pvz_price: PropTypes.number,
    courier_price: PropTypes.number,
    currSymbol: PropTypes.string,
    deliverySelect: PropTypes.number,

};

export default DeliverySelector;