import { createStore, compose, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import { routerMiddleware } from "react-router-redux";
import { createBrowserHistory } from "history";
import { rootReducer } from "../reducers/rootReducer";
import { cartMiddleware } from "../middleware/cartMiddleware";
//import { productMiddleware } from "../middleware/productMiddleware";

export const history = createBrowserHistory();

//const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()

const onDevTools =
  process.env.NODE_ENV !== "production" ||
  process.env.REACT_APP_REDUX_DEVTOOLS_ON;

const composeEnhancers = onDevTools
  ? (typeof window !== "undefined" &&
      window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) ||
    compose
  : compose;

const enhancer = composeEnhancers(
  applyMiddleware(
    thunk,
    routerMiddleware(history),
    cartMiddleware
    // productMiddleware
  )
);

const store = createStore(rootReducer, enhancer);

export default store;
