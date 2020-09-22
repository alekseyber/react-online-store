import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { openDelivery } from '../../redux/actions/modaldialog';


const DeliveryCityCarrent = () => {

    const { city } = useSelector(state => state.delivery);
    const dispatch = useDispatch();

    const openDeliveryHandler = () => {
        dispatch(openDelivery());
    }


    // if (!city.cityName) {
    //     return null
    // }


    return (
        <Box mt={1} mb={1}>
            <Typography variant="subtitle2" component="span" color="textSecondary" className="mr-1">Город:</Typography>
            <Typography variant="subtitle1" component="span" className="font-weight-black">{city.cityName}</Typography>
            <Button variant="contained" color="primary" size="small" className="ml-2" onClick={openDeliveryHandler}>Изменить</Button>
        </Box>
    )
}



export default DeliveryCityCarrent;