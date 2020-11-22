import React, { ReactNode } from "react"; //, { Suspense, lazy }
import { Switch, Route } from "react-router-dom";
//import { useLocation } from 'react-use';
//import { animated, useTransition } from 'react-spring';
import MainPage from "../pages/main/MainPage";
import CategoryPage from "../pages/category/CategoryPage";
import ProductPage from "../pages/product/ProductPage";
import CartPage from "../pages/cart/CartPage";
import DeliveryPage from "../pages/delivery/DeliveryPage";
import OrderDonePage from "../pages/order/OrderDonePage";
import OrderPage from "../pages/order/OrderPage";
import AddCartPage from "../pages/addcart/AddCartPage";
import PagePage from "../pages/page/PagePage";
import PageFoundPage from "../pages/pagefound/PageFoundPage";
import ReturnProductPage from "../pages/returnproduct/ReturnProductPage";
import SearchPage from "../pages/search/SearchPage";
import CommentPage from "../pages/comment/CommentPage";
import IndexNewsPage from "../pages/news/IndexNewsPage";
import NewsPage from "../pages/news/NewsPage";

//import ErrorBoundary from '../hoc/ErrorBoundary';

// const MainPage = lazy(() => import('../pages/main/mainPage'));
// const CategoryPage = lazy(() => import('../pages/category/categoryPage'));
// const PageFoundPage = lazy(() => import('../pages/pagefound/pageFoundPage'));

export const useRoutes = (): ReactNode => {
  return (
    <Switch>
      <Route path="/" exact>
        <MainPage />
      </Route>
      <Route path="/category/:alias" exact>
        <CategoryPage />
      </Route>
      <Route path="/product/:alias" exact>
        <ProductPage />
      </Route>
      <Route path="/cart" exact>
        <CartPage />
      </Route>
      <Route path="/delivery" exact>
        <DeliveryPage />
      </Route>
      <Route path="/order/done" exact>
        <OrderDonePage />
      </Route>
      <Route path="/order/:id" exact>
        <OrderPage />
      </Route>
      <Route path="/addcart/:id" exact>
        <AddCartPage />
      </Route>
      <Route path="/page/:alias" exact>
        <PagePage />
      </Route>
      <Route path="/returnproduct" exact>
        <ReturnProductPage />
      </Route>
      <Route path="/search" exact>
        <SearchPage />
      </Route>
      <Route path="/comment" exact>
        <CommentPage />
      </Route>
      <Route path="/news/:alias" exact>
        <NewsPage />
      </Route>
      <Route path="/news" exact>
        <IndexNewsPage />
      </Route>
      <Route path="*">
        <PageFoundPage />
      </Route>
    </Switch>
  );

  // export { useRoutes };

  // const location = useLocation();

  // const transitions = useTransition(location, location => location.pathname, {
  //   from: { opacity: 0 }, //, transform: 'translate3d(100%,0,0)'
  //   enter: { opacity: 1 }, //, transform: 'translate3d(0%,0,0)'
  //   leave: { opacity: 0 }, //, transform: 'translate3d(-50%,0,0)'
  // })

  // return transitions.map(({ item: location, props, key }) => (
  //   <animated.div key={key} style={props}>
  //     <Switch location={location}>
  //       <Route path="/" exact>
  //         <MainPage />
  //       </Route>
  //       <Route path="/category/:alias" exact>
  //         <CategoryPage />
  //       </Route>
  //       <Route>
  //         <PageFoundPage />
  //       </Route>
  //     </Switch>
  //   </animated.div>
  // ))
};
