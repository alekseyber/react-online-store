import { useMemo } from 'react';
import { useSelector } from 'react-redux';



const useCartSumm = () => {




    const { cartData, cuponData } = useSelector(state => state.cart);
    const discontcupon = cuponData.discontcupon

    return useMemo(() => {
        const summ = cartData.reduce((sum, current) => sum + current.qty * current.price, 0);
        const summcupon = Math.ceil(summ * discontcupon);
       
        const summCart = {
            summ,
            summcupon: (summcupon < 0) ? summ : summcupon,
            discont: 0
        }
        summCart.discont = summCart.summ - summCart.summcupon

        return summCart

    }, [cartData, discontcupon])

}

export { useCartSumm };