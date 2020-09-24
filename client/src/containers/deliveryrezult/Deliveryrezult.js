import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import Typography from '@material-ui/core/Typography';
import DefaultDeliveryText from './defaultdeliverytext/DefaultDeliveryText';
import DeliveryRegion from './deliveryregion/DeliveryRegion';
import { useDeliveryDateHome } from '../../hooks/delivery-date-home.hook';
import DeliveryCityCarrent from '../../components/deliverycitycarrent/DeliveryCityCarrent';

const DeliveryRezult = ({ pvz_selector, city_name_v, sel_pvz_v }) => {
    const { cityDefault, defaultDeliveryText, defaultDeliveryRegionText, maxDeliveryHourToday } = useSelector(state => state.start.paramsData);
    const { city, status } = useSelector(state => state.delivery);
    const cityDefaultStatus = cityDefault.id === city.id;
    const homeDat = useDeliveryDateHome(maxDeliveryHourToday);

    const RezultBody = () => {
        if (cityDefaultStatus) {
            return (
                <>
                    <DefaultDeliveryText content={defaultDeliveryText} />
                    <div>
                        <Typography variant="body2" component="span">Ближайшая дата доставки -</Typography>
                        <Typography variant="body2" component="span" className="font-weight-black ml-1">{homeDat}</Typography>
                    </div>

                </>
            )
        }

        if (!status) {
            return <DefaultDeliveryText content={defaultDeliveryRegionText} />
        }

        return <DeliveryRegion pvz_selector={pvz_selector} sel_pvz_v={sel_pvz_v}/>
    };


    return (
        <>
            {city_name_v && <DeliveryCityCarrent />}
            <Typography variant="subtitle1" component="h3" gutterBottom className="font-weight-black">Стоимость и сроки доставки:</Typography>
            <RezultBody />
        </>
    )


}
//input pvz_selector
DeliveryRezult.defaultProps = {
    pvz_selector: false,
    city_name_v: false,
    sel_pvz_v: true
};

DeliveryRezult.propTypes = {
    pvz_selector: PropTypes.bool,
    city_name_v: PropTypes.bool,
    sel_pvz_v: PropTypes.bool,
};

export default DeliveryRezult;