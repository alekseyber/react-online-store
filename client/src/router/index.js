import React from 'react'; //, { Suspense, lazy }
import { Switch, Route } from 'react-router-dom';
//import { useLocation } from 'react-use';
//import { animated, useTransition } from 'react-spring';
import MainPage from '../pages/main/mainPage';
import CategoryPage from '../pages/category/categoryPage';
import ProductPage from '../pages/product/productPage';
import CartPage from '../pages/cart/cartPage';
import DeliveryPage from '../pages/delivery/devileryPage';
import OrderDonePage from '../pages/order/orderDonePage';
import OrderPage from '../pages/order/orderPage';
import AddCartPage from '../pages/addcart/addCardPage';
import PagePage from '../pages/page/pagePage';
import PageFoundPage from '../pages/pagefound/pageFoundPage';
import ReturnProductPage from '../pages/returnproduct/returnProductPage';
import SearchPage from '../pages/search/searchPage';
import CommentPage from '../pages/comment/commentPage';
import IndexNewsPage from '../pages/news/indexNewsPage';
import MewsPage from '../pages/news/newsPage';


//import ErrorBoundary from '../hoc/ErrorBoundary';


// const MainPage = lazy(() => import('../pages/main/mainPage'));
// const CategoryPage = lazy(() => import('../pages/category/categoryPage'));
// const PageFoundPage = lazy(() => import('../pages/pagefound/pageFoundPage'));




export const useRoutes = () => {

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
        <MewsPage />
      </Route>
      <Route path="/news" exact>
        <IndexNewsPage />
      </Route>
      <Route path="*">
        <PageFoundPage />
      </Route>
    </Switch>
  )


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

}



