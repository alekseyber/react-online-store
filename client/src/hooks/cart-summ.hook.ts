import { useMemo } from "react";
import { useQueryApp } from "./appolloQueryApp.hook";
import { USE_CART_SUMM_QUERY, IUseCartSumm } from "../graphql/gqlQuery";

const useCartSumm = () => {
  const { data } = useQueryApp<IUseCartSumm>(USE_CART_SUMM_QUERY);

  const { cartData, discontcupon } = useMemo<IUseCartSumm>(() => {
    const rezult: IUseCartSumm = {
      cartData: [],
      discontcupon: 1,
    };
    if (data) {
      rezult.cartData = data.cartData;
      rezult.discontcupon = data.discontcupon;
    }
    return rezult;
  }, [data]);

  return useMemo(() => {
    const summ = cartData.reduce(
      (sum, current) => sum + current.qty * current.price,
      0
    );
    const summcupon = Math.ceil(summ * discontcupon);

    const summCart = {
      summ,
      summcupon: summcupon < 0 ? summ : summcupon,
      discont: 0,
    };
    summCart.discont = summCart.summ - summCart.summcupon;

    return summCart;
  }, [cartData, discontcupon]);
};

export { useCartSumm };
