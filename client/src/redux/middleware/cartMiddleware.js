import { reactLocalStorage } from 'reactjs-localstorage';
import { CART_ADD, CART_UPDATE, CART_ADD_COUNT, CART_SET_CUPON, CART_CLEAR_CUPON } from '../constants';

// reactLocalStorage.set('var', true);
// reactLocalStorage.get('var', true);
// reactLocalStorage.setObject('var', {'test': 'test'});
// reactLocalStorage.getObject('var');
// reactLocalStorage.remove('var');
// reactLocalStorage.clear();

export const cartMiddleware = ({ getState }) => {
    return next => action => {
        //   console.log('will dispatch', action)
        const type = action.type;

        const returnValue = next(action);

        let keyStorage = null;

        if (
            type === CART_ADD ||
            type === CART_ADD_COUNT ||
            type === CART_UPDATE
        ) {
            keyStorage = 'cartData';
        }
        if (type === CART_SET_CUPON || type === CART_CLEAR_CUPON) {
            keyStorage = 'cuponData';
        }

        // console.log('state after dispatch', getState())

        if (keyStorage) {
            const { cart } = getState();
            reactLocalStorage.setObject(keyStorage, cart[keyStorage]);
        }

        return returnValue
    }
}