import { makeVar, ReactiveVar } from "@apollo/client";
import { showAlert } from "./localVarsApp";
import { openAddedCart, openQOrder } from "./localVarsModal";
import { TProductLevel2, ProductFragment } from "./gqlQuery";
import { IProductRezult } from "../hooks/useProductDataRender.hook";

const setObjectLocalStorage = (key: string, value: any): void => {
  localStorage[key] = JSON.stringify(value);
};

const getObjectLocalStorage = <T>(key: string, defaultValue: T): T => {
  const value: any = localStorage[key];

  if (!value) {
    return defaultValue;
  }

  return JSON.parse(value);
};

export interface ICuponData {
  discontcupon: number;
  cuponId: string;
}

export interface IItemCartDataForAdd {
  alias: string;
  price: number;
  level1: string;
  level2: string;
}

export interface IItemCartData extends IItemCartDataForAdd {
  idItem: string;
  qty: number;
}

export type TCartData = IItemCartData[];

const initialCuponData: ICuponData = {
  discontcupon: 1,
  cuponId: "",
};

export interface ILastCart {
  gender: string;
  title: string;
  imgThumb: string;
  old_price: number;
  price: number;
  level1: null | string;
  level2: null | string;
}

type TInitialState = {
  cartData: TCartData;
  lastCart: ILastCart;
  cuponData: ICuponData;
};

const getCuponDataLocalStorageValidate = () => {
  const initPrevCuponData = getObjectLocalStorage<ICuponData>(
    "cuponData",
    initialCuponData
  );

  if (typeof initPrevCuponData !== "object") {
    return initialCuponData;
  }
  if (
    initPrevCuponData.discontcupon <= 1 &&
    initPrevCuponData.discontcupon > 0 &&
    typeof initPrevCuponData.discontcupon === "string"
  ) {
    return initPrevCuponData;
  }

  return initialCuponData;
};

//reactLocalStorage.getObject("cartData", [], true),
const initPrevCartData = getObjectLocalStorage<TCartData>("cartData", []);
const initCartData = Array.isArray(initPrevCartData) ? initPrevCartData : [];
const initCuponData = getCuponDataLocalStorageValidate();

const initialState: TInitialState = {
  cartData: initCartData,
  lastCart: {
    gender: "",
    title: "",
    imgThumb: "",
    old_price: 0,
    price: 0,
    level1: null,
    level2: null,
  },
  cuponData: initCuponData,
};

export const cartDataVar: ReactiveVar<TCartData> = makeVar<TCartData>(
  initialState.cartData
);
export const lastCartVar = makeVar<ILastCart>(initialState.lastCart);
export const cuponDataVar = makeVar<ICuponData>(initialState.cuponData);
export const countAddVar = makeVar<number>(0);

interface IItemLevel1 {
  [alias: string]: string;
}

interface IItemLevel2 {
  [alias: string]: string | null;
}

interface IProductSelect {
  level1: IItemLevel1;
  level2: IItemLevel2;
}

export const productSelectVar = makeVar<IProductSelect>({
  level1: {},
  level2: {},
});

const setLevel1Select = (alias: string, level1: string): void => {
  // [SET_COLOR]
  const productSelect = productSelectVar();
  const newProductSelect = {
    ...productSelect,
    level1: { ...productSelect.level1, [alias]: level1 },
  };
  productSelectVar(newProductSelect);
};

const setLevel2Select = (alias: string, level2: string): void => {
  // [SET_SIZE]
  const productSelect = productSelectVar();
  const newProductSelect = {
    ...productSelect,
    level2: { ...productSelect.level2, [alias]: level2 },
  };
  productSelectVar(newProductSelect);
};

const setLevel1AndLevel2Select = (
  alias: string,
  level1: string,
  level2: string | null
): void => {
  //[SET_COLOR_SIZE]
  const productSelect = productSelectVar();

  const newProductSelect = {
    ...productSelect,
    level1: { ...productSelect.level1, [alias as keyof IItemLevel1]: level1 },
    level2: { ...productSelect.level2, [alias as keyof IItemLevel2]: level2 },
  };
  productSelectVar(newProductSelect);
};

export const setSizeProduct = (alias: string, level2: string): void => {
  setLevel2Select(alias, level2);
};

export const setColorAndSizeProduct = (
  alias: string,
  level1: string,
  level2: string
): void => {
  setLevel1AndLevel2Select(alias, level1, level2);
};

export const setColorProductAction = (
  alias: string,
  level1: string,
  level2: TProductLevel2[]
): void => {
  const productSelect = productSelectVar();

  let resetSize: boolean = false;

  let selectSize: null | string = null;

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

const cartUpdate = (cart: IItemCartData[] = []): void => {
  cartDataVar(cart);
  setObjectLocalStorage("cartData", cart);
  //reactLocalStorage.setObject("cartData", cart);
};

export const cartClear = (): void => {
  cartUpdate();
};

export const cartSetCupon = (cupon: ICuponData = initialCuponData): void => {
  setObjectLocalStorage("cuponData", cupon);
  //reactLocalStorage.setObject("cuponData", cupon);
  cuponDataVar(cupon);
  showAlert("Промокод успешно добавлен");
};

export const cartClearCupon = (): void => {
  setObjectLocalStorage("cuponData", initialCuponData);
  // reactLocalStorage.setObject("cuponData", initialCuponData);
  cuponDataVar(initialCuponData);
};

export const cartDeleteItem = (index: number): void => {
  const cartData = cartDataVar();
  const newCatdData = cartData.filter((_, i: number) => i !== index);
  cartUpdate(newCatdData);
};

export const cartChangeItemCount = (index: number, qty: number): void => {
  const cartData: IItemCartData[] = cartDataVar();
  const newCartData: IItemCartData[] = [...cartData].map(
    (el: IItemCartData, i) => {
      if (index === i) {
        return { ...el, qty };
      }
      return el;
    }
  );

  cartUpdate(newCartData);
};

export const cartEditItem = (
  index: number,
  level1: string | null = null,
  level2: string,
  product?: ProductFragment
): void | null => {
  const cartData: IItemCartData[] = cartDataVar();

  let edit = false;

  const newItem: IItemCartData = {
    alias: cartData[index].alias,
    qty: cartData[index].qty,
    price: cartData[index].price,
    level1: cartData[index].level1,
    level2: cartData[index].level2,
    idItem: "",
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

  const newCartData: IItemCartData[] = cartData.map((elItem, ind: number) => {
    if (index === ind) {
      return newItem;
    }
    return elItem;
  });

  const cartForUpdate = newCartData.filter((item: IItemCartData, i: number) => {
    if (index === i) {
      return true;
    }
    return !(item.idItem === newItem.idItem);
  });
  cartUpdate(cartForUpdate);
};

const cartAddCheced = ({
  alias,
  level1,
  level2,
  price,
}: IItemCartDataForAdd) => {
  const cartData = cartDataVar();
  const idItem = alias + level1 + level2;

  const index = cartData.findIndex((item) => item.idItem === idItem);

  const countAdd = countAddVar();
  countAddVar(countAdd + 1);

  let newcCartData = [];

  if (index > -1) {
    newcCartData = cartData.map((itemCartData, i) =>
      i === index
        ? { ...itemCartData, qty: itemCartData.qty + 1 }
        : itemCartData
    );
  } else {
    const qty = 1;
    const item = { idItem, alias, level1, level2, price, qty };
    newcCartData = [...cartData, item];
  }
  cartUpdate(newcCartData);
};

export const cartAddAction = (
  product: IProductRezult,
  qorder: boolean = false
): void | boolean => {
  const productSelect = productSelectVar();
  if (!productSelect) {
    return console.error("cartAddAction - productSelect - undefined");
  }

  const alias = product.alias;
  const level1 = product.current.alias;
  const sizeSelectTrue =
    product.product_model === 1 || product.product_model === 4;

  const level2Candidat: string | null = productSelect.level2[alias];

  const price = product.price;
  const lastCart: ILastCart = {
    gender: product.gender,
    title: product.title,
    imgThumb: product.imgThumb,
    old_price: product.old_price,
    price: price,
    level1: null,
    level2: null,
  };

  if (!level2Candidat && sizeSelectTrue) {
    return true;
  }

  const level2: string = level2Candidat || product.current.level2[0].alias;

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

export const cartAddPageAction = ({
  alias,
  level1,
  level2,
  price,
}: IItemCartDataForAdd): boolean => {
  cartAddCheced({ alias, level1, level2, price });
  return true;
};
