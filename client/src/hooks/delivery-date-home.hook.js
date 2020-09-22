//import { useMemo } from 'react';
//import { useSelector } from 'react-redux';


const useDeliveryDateHome = (maxDeliveryHourToday = 0) => {

    // const { maxDeliveryHourToday } = useSelector(state => state.start.paramsData);

    let currentDate = new Date();
    const today = !(currentDate.getHours() > maxDeliveryHourToday);
    const start = today ? "сегодня" : "завтра";
    if (!today) {
        currentDate.setDate(currentDate.getDate() + 1);
    }
    const day = ("0" + currentDate.getDate()).slice(-2);
    const year = currentDate.getFullYear();
    const month = ("0" + (currentDate.getMonth() + 1)).slice(-2);

    return `${start} ${day}.${month}.${year}`;

}

export { useDeliveryDateHome };