import { useSelector } from 'react-redux';



const useDeliveryPrice = () => {


    const { courier, pvz, city, status, deliverySelect } = useSelector(state => state.delivery);
    const { cityDefault } = useSelector(state => state.start.paramsData);

    const cityDefaultStatus = cityDefault.id === city.id;

    if (cityDefaultStatus || !status) {
        return 0
    }

    const price = (deliverySelect === 0) ? courier.priceByCurrency : pvz.priceByCurrency;

    return price

}

export { useDeliveryPrice };