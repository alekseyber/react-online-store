import React from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import DeliveryBanners from '../../components/deliverybanners/Deliverybanners';
import DeliveryCity from '../../components/deliverycity/Deliverycity';
import DeliveryRezult from '../deliveryrezult/Deliveryrezult';



const Delivery = () => {


    return (
        <>
            <DeliveryBanners />
            <DeliveryCity />
            <Card>
                <CardContent>
                    <DeliveryRezult />
                </CardContent>
            </Card>
        </>

    )
}

export default Delivery;