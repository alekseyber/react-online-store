import { CART_ADD, CART_UPDATE, CART_ADD_COUNT, CART_SET_CUPON, CART_CLEAR_CUPON } from '../constants';
import { openAddedCart, openQOrder } from './modaldialog';
import { httpActions } from './../../hooks/http.hook';
import { showAlert } from './app';
import { updateProducts } from './products';
import { history } from '../store';

const cartAdd = (payload) => {

    return {
        type: CART_ADD,
        payload
    }
}

export const cartUpdate = (payload) => {

    return {
        type: CART_UPDATE,
        payload
    }
}

const cartAddItemCount = (payload) => {

    return {
        type: CART_ADD_COUNT,
        payload
    }
}

const cartClearCupon = () => {

    return {
        type: CART_CLEAR_CUPON,

    }
}

const cartSetCupon = (payload) => {

    return {
        type: CART_SET_CUPON,
        payload
    }
}

export const cartAddCupon = cupontext => async (dispatch) => { //, getState
    const { requestFormLoader } = httpActions(dispatch);
    const status = {
        msg: "Купон не найден",
        type: "error"
    }
    try {
        cupontext = String(cupontext);

        if (cupontext.length > 5 && cupontext.length < 12) {

            const cuponData = await requestFormLoader('/api/order/getcupon', 'get', { cupontext });

            const value = Number(cuponData.value);
            if (value > 0 && value <= 1) {
                const rezult = {
                    cupon: cupontext,
                    discontcupon: value,
                    cuponId: cuponData.cuponId,
                }
                dispatch(cartSetCupon(rezult));
                status.msg = "Купон успешно добавлен";
                status.type = "success";
            }


        }

    } catch (e) {
        dispatch(cartClearCupon());
        // console.error(e);
    } finally {
        dispatch(showAlert(status.msg, status.type));
    }

}


export const cartDeleteItem = (index) => (dispatch, getState) => { //, getState
    const { cart } = getState();
    const cartData = cart.cartData.filter((_, i) => i !== index);
    dispatch(cartUpdate(cartData));
}

export const cartChangeItemCount = (index, qty) => (dispatch, getState) => { //, getState
    const { cart } = getState();
    const cartData = [...cart.cartData];
    if (cartData[index]) {
        cartData[index].qty = qty;
        dispatch(cartUpdate(cartData));
    }
}

export const cartEditItem = (index, level1 = null, level2 = null) => (dispatch, getState) => {
    const { cart } = getState();
    const cartData = [...cart.cartData];
    const alias = cartData[index].alias;
    let edit = false;

    if (level1) {
        const { products } = getState();
        const product = products[alias];
        if (product) {
            cartData[index].price = (product.level1[level1].price > 0) ? product.level1[level1].price : product.price;
        }
        if (cartData[index].level1 !== level1) {
            cartData[index].level1 = level1;
            edit = true;
        }

    } else {
        level1 = cartData[index].level1;
    }

    if (level2) {
        if (cartData[index].level2 !== level2) {
            cartData[index].level2 = level2;
            edit = true;
        }
    } else {
        level2 = cartData[index].level2;
    }

    const idItem = alias + level1 + level2;
    cartData[index].idItem = idItem;

    const cartForUpdate = cartData.filter((item, i) => {
        if (index === i) {
            return true
        }
        return (!(item.idItem === idItem))
    });
    if (edit) {
        dispatch(cartUpdate(cartForUpdate));
    }
}




export const cartAddAction = (product, qorder = false) => (dispatch, getState) => { //, getState

    const { productselect, start, cart } = getState();
    const alias = product.alias;
    const level1 = product.select_color;
    const sizeSelectTrue = (product.product_model === 1 || product.product_model === 4);
    let level2 = productselect.size[alias];
    const price = product.price;
    const lastCart = {
        gender: product.gender,
        title: product.title,
        imgThumb: product.imgThumb,
        old_price: product.old_price,
        price: price,
        level1: null,
        level2: null,
        currSymbol: start.paramsData.currSymbol
    }

    if (!level2) {
        if (sizeSelectTrue) {
            return true
        }
        level2 = product.select_level2[0];
    }

    if (product.product_model <= 2) {
        lastCart.level1 = start.colorsData.colors[level1].title;
    }

    if (sizeSelectTrue) {
        lastCart.level2 = start.sizesData[level2].title;
    }

    const idItem = alias + level1 + level2;

    const cartData = [...cart.cartData];

    const index = cartData.findIndex((item) => item.idItem === idItem);

    if (index > -1) {
        cartData[index].qty++;
        dispatch(cartAddItemCount({ cartData, lastCart }));

    } else {
        const qty = 1;
        //  const _id = product._id;
        const item = { idItem, alias, level1, level2, price, qty };
        dispatch(cartAdd({ item, lastCart }));
    }
    if (qorder) {
        dispatch(openQOrder());
    } else {
        dispatch(openAddedCart());
    }

}



export const cartAddPageAction = (id) => async (dispatch) => { //, getState

    const { requestRedirect } = httpActions(dispatch);

    try {
        const productData = await requestRedirect(
            `/api/products/getproductbylevel/${id}`
        );

        const alias = productData.alias;
        const level1 = productData.color;
        const level2 = productData.sizes;
        const idItem = alias + level1 + level2;
        const price = productData.price;
        const qty = 1;
        const cartData = [{ idItem, alias, level1, level2, price, qty }];
        await dispatch(updateProducts([{ alias }], true));
        dispatch(cartUpdate(cartData));
        history.replace('/cart');
    } catch (e) { }

}