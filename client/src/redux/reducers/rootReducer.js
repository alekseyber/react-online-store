import { combineReducers } from "redux";
//import { appReducer } from "./appReducer";
//import { startReducer } from './startReducer';
//import { mainReducer } from './mainReducer';
//import { productsReducer } from './productsReducer';
//import { productselectReducer } from "./productselectReducer";
//import { categoryReducer } from './categoryReducer';
import { filterReducer } from "./filterReducer";
//import { modaldialogReducer } from "./modaldialogReducer";
//import { cartReducer } from "./cartReducer";
//import { deliveryReducer } from "./deliveryReducer";
import { orderReducer } from "./orderReducer";
//import { pageReducer } from './pageReducer';

export const rootReducer = combineReducers({
 // app: appReducer,
  //   start: startReducer,
  //   main: mainReducer,
  //    products: productsReducer,
 // productselect: productselectReducer,
  //   category: categoryReducer,
  filter: filterReducer,
 // modaldialog: modaldialogReducer,
 // cart: cartReducer,
//  delivery: deliveryReducer,
  order: orderReducer,
  //   page: pageReducer,
});
