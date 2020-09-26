import { SET_PRODUCTS } from "../constants";
import { checkCart } from "../actions/start";

export const productMiddleware = ({ getState, dispatch }) => {
  return (next) => (action) => {
    //   console.log('will dispatch', action)
    const type = action.type;

    const returnValue = next(action);

    if (type === SET_PRODUCTS) {
      const { cart, products } = getState();
      checkCart(cart.cartData, products, dispatch, false);
      // console.log("state after dispatch", cart.cartData);
    }

    return returnValue;
  };
};
