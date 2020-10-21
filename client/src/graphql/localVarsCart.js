import { makeVar } from "@apollo/client";
import { reactLocalStorage } from "reactjs-localstorage";
import { showAlert } from "./localVarsApp";
import { openAddedCart, openQOrder } from "./localVarsModal";

const initialCuponData = {
  discontcupon: 1,
  cuponId: "",
};

const initialState = {
  cartData: reactLocalStorage.getObject("cartData", [], true),
  lastCart: {
    gender: "",
    title: "",
    imgThumb: "",
    old_price: 0,
    price: 0,
    color: null,
    size: null,
  },
  cuponData: reactLocalStorage.getObject("cuponData", initialCuponData, true),
};

export const cartDataVar = makeVar(initialState.cartData);
export const lastCartVar = makeVar(initialState.lastCart);
export const cuponDataVar = makeVar(initialState.cuponData);
export const countAddVar = makeVar(0);

export const productSelectVar = makeVar({
  level1: {},
  level2: {},
});

const setLevel1Select = (alias, level1) => {
  // [SET_COLOR]
  const productSelect = productSelectVar();
  const newProductSelect = {
    ...productSelect,
    level1: { ...productSelect.level1, [alias]: level1 },
  };
  productSelectVar(newProductSelect);
};

const setLevel2Select = (alias, level2) => {
  // [SET_SIZE]
  const productSelect = productSelectVar();
  const newProductSelect = {
    ...productSelect,
    level2: { ...productSelect.level2, [alias]: level2 },
  };
  productSelectVar(newProductSelect);
};

const setLevel1AndLevel2Select = (alias, level1, level2) => {
  //[SET_COLOR_SIZE]
  const productSelect = productSelectVar();
  const newProductSelect = {
    ...productSelect,
    level1: { ...productSelect.level1, [alias]: level1 },
    level2: { ...productSelect.level2, [alias]: level2 },
  };
  productSelectVar(newProductSelect);
};

export const setSizeProduct = (alias, level2) => {
  setLevel2Select(alias, level2);
};

export const setColorAndSizeProduct = (alias, level1, level2) => {
  setLevel1AndLevel2Select(alias, level1, level2);
};

export const setColorProductAction = (alias, level1, level2) => {
  const productSelect = productSelectVar();

  let resetSize = false;

  let selectSize = null;

  if (alias in productSelect.level1) {
    selectSize = productSelect.level1[alias];
  }

  if (selectSize) {
    const indexLevel2 = level2.findIndex((el) => el.alias === selectSize);

    if (indexLevel2 === -1) {
      resetSize = true;
    }
  }
  if (!resetSize) {
    setLevel1Select(alias, level1);
  } else {
    setLevel1AndLevel2Select(alias, level1, null);
  }
};

const cartUpdate = (cart = []) => {
  cartDataVar(cart);
  reactLocalStorage.setObject("cartData", cart);
};

export const cartClear = () => {
  cartUpdate();
};

export const cartSetCupon = (cupon = initialCuponData) => {
  reactLocalStorage.setObject("cuponData", cupon);
  cuponDataVar(cupon);
  showAlert("Промокод успешно добавлен");
};

export const cartClearCupon = () => {
  reactLocalStorage.setObject("cuponData", initialCuponData);
  cuponDataVar(initialCuponData);
};

export const cartDeleteItem = (index) => {
  const cartData = cartDataVar();
  const newCatdData = cartData.filter((_, i) => i !== index);
  cartUpdate(newCatdData);
};

export const cartChangeItemCount = (index, qty) => {
  const cartData = cartDataVar();
  const newCartData = cartData.map((el, i) => {
    if (index === i) {
      return { ...el, qty };
      //el.qty = qty;
    }
    return el;
  });

  cartUpdate(newCartData);
};

export const cartEditItem = (index, level1 = null, level2 = null, product) => {
  const cartData = cartDataVar();

  let edit = false;

  const newItem = {
    alias: cartData[index].alias,
    qty: cartData[index].qty,
    price: cartData[index].price,
    level1: cartData[index].level1,
    level2: cartData[index].level2,
  };

  if (level1 && newItem.level1 !== level1) {
    if (product) {
      const currentProduct = product.level1Arr.find(
        (el) => el.alias === level1
      );
      if (currentProduct) {
        if (currentProduct.price > 0) {
          newItem.price = currentProduct.price;
        }
      }
    }

    newItem.level1 = level1;
    edit = true;
  }

  if (level2 && newItem.level2 !== level2) {
    newItem.level2 = level2;
    edit = true;
  }

  if (!edit) {
    return null;
  }

  newItem.idItem = newItem.alias + newItem.level1 + newItem.level2;

  const newCartData = cartData.map((elItem, ind) => {
    if (index === ind) {
      return newItem;
    }
    return elItem;
  }); 

  const cartForUpdate = newCartData.filter((item, i) => {
    if (index === i) {
      return true;
    }
    return !(item.idItem === newItem.idItem);
  });
  cartUpdate(cartForUpdate);
};

const cartAddCheced = ({ alias, level1, level2, price }) => {
  const cartData = cartDataVar();
  const idItem = alias + level1 + level2;

  const index = cartData.findIndex((item) => item.idItem === idItem);
  const countAdd = countAddVar();
  countAddVar(countAdd + 1);

  if (index > -1) {
    cartData[index].qty++;
    cartUpdate(cartData);
  } else {
    const qty = 1;
    const item = { idItem, alias, level1, level2, price, qty };
    const newcCartData = [...cartData, item];
    cartUpdate(newcCartData);
  }
};

export const cartAddAction = (product, qorder = false) => {
  const productSelect = productSelectVar();

  const alias = product.alias;
  const level1 = product.current.alias;
  const sizeSelectTrue =
    product.product_model === 1 || product.product_model === 4;

  let level2 = productSelect.level2[alias];

  const price = product.price;
  const lastCart = {
    gender: product.gender,
    title: product.title,
    imgThumb: product.imgThumb,
    old_price: product.old_price,
    price: price,
    level1: null,
    level2: null,
  };

  if (!level2) {
    if (sizeSelectTrue) {
      return true;
    }
    level2 = product.current.level2[0].alias;
  }

  if (product.product_model <= 2) {
    lastCart.level1 = product.current.colorItem.title;
  }

  if (sizeSelectTrue) {
    const selectedLevel2 = product.current.level2.find(
      (l2) => l2.alias === level2
    );
    if (selectedLevel2) {
      lastCart.level2 = selectedLevel2.sizeItem.title;
    }
  }
  lastCartVar(lastCart);
  cartAddCheced({ alias, level1, level2, price });

  if (qorder) {
    openQOrder();
  } else {
    openAddedCart();
  }
};

export const cartAddPageAction = ({ alias, level1, level2, price }) => {
  cartAddCheced({ alias, level1, level2, price });
  return true;
};
