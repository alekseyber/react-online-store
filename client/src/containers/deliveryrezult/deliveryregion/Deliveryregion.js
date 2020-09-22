import React from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import DeliveryRezulText from '../../../components/deliveryrezulttext/Deliveryrezulttext';
import DeliverySelector from '../../../components/deliveryreselector/Deliveryselectror';




const DeliveryRegion = ({ pvz_selector, sel_pvz_v }) => {

    const { courier, pvz, deliverySelect } = useSelector(state => state.delivery);
    const { currSymbol, textDeliveryProduct } = useSelector(state => state.start.paramsData);
    const courierVisible = (((pvz_selector && deliverySelect === 0) || !pvz_selector) && courier);
    const pvzVisible = (((pvz_selector && deliverySelect === 1) || !pvz_selector) && courier);

    return (
        <>
            {pvz_selector && <DeliverySelector pvz_price={pvz.priceByCurrency} courier_price={courier.priceByCurrency} deliverySelect={deliverySelect} currSymbol={currSymbol} />}
            {courierVisible && <DeliveryRezulText price={courier.priceByCurrency} dateMax={courier.deliveryDateMax} currSymbol={currSymbol} />}
            {pvzVisible && <DeliveryRezulText pvz={true} price={pvz.priceByCurrency} dateMax={pvz.deliveryDateMax} currSymbol={currSymbol} sel_pvz_v={sel_pvz_v} />}
            {textDeliveryProduct && <Typography variant="subtitle1" component="div" className="font-weight-black">{textDeliveryProduct}</Typography>}
        </>
    )

}
DeliveryRegion.defaultProps = {
    pvz_selector: false,
    sel_pvz_v: true
};

DeliveryRegion.propTypes = {
    pvz_selector: PropTypes.bool,
    sel_pvz_v: PropTypes.bool,
};

export default DeliveryRegion;