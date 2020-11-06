import { useMemo } from "react";
import { useQueryApp } from "./appolloQueryApp.hook";
import { USE_CART_SUMM_QUERY, IUseCartSumm } from "../graphql/gqlQuery";

interface ISummCart {
  summ: number;
  summcupon: number;
  discont: number;
}

const useCartSumm = () => {
  const { data } = useQueryApp<IUseCartSumm>(USE_CART_SUMM_QUERY);

  return useMemo<ISummCart>(() => {
    const rezult: ISummCart = {
      summ: 0,
      summcupon: 0,
      discont: 0,
    };

    if (!data) return rezult;

    const { cartData, discontcupon } = data;

    const summ = cartData.reduce(
      (sum, current) => sum + current.qty * current.price,
      0
    );
    const summcupon = Math.ceil(summ * discontcupon);

    rezult.summ = summ;
    rezult.summcupon = summcupon < 0 ? summ : summcupon;

    // const summCart = {
    //   summ,
    //   summcupon: summcupon < 0 ? summ : summcupon,
    //   discont: 0,
    // };
    rezult.discont = rezult.summ - rezult.summcupon;

    return rezult;
  }, [data]);
};

export { useCartSumm };
