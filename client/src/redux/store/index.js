import { createStore, compose, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { routerMiddleware } from 'react-router-redux';
import { createBrowserHistory } from 'history'
import { rootReducer } from '../reducers/rootReducer';
import { cartMiddleware } from '../middleware/cartMiddleware';

export const history = createBrowserHistory();

//const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()




const composeEnhancers = (typeof window !== 'undefined' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || compose;

const enhancer = composeEnhancers(applyMiddleware(
    thunk, routerMiddleware(history), cartMiddleware
));

const store = createStore(rootReducer, enhancer);


export default store;