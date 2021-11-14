import { ReactNode, Suspense, lazy } from "react";
import { Switch, Route } from "react-router-dom";
import PageSceleton from "../components/skeletons/PageSceleton";
import ProductListSceleton from "../components/skeletons/ProductListSceleton";

// import MainPage from "../pages/main/MainPage";
// import CategoryPage from "../pages/category/CategoryPage";
// import ProductPage from "../pages/product/ProductPage";
// import CartPage from "../pages/cart/CartPage";
// import DeliveryPage from "../pages/delivery/DeliveryPage";
// import OrderDonePage from "../pages/order/OrderDonePage";
// import OrderPage from "../pages/order/OrderPage";
// import AddCartPage from "../pages/addcart/AddCartPage";
// import PagePage from "../pages/page/PagePage";
// import PageFoundPage from "../pages/pagefound/PageFoundPage";
// import ReturnProductPage from "../pages/returnproduct/ReturnProductPage";
// import SearchPage from "../pages/search/SearchPage";
// import CommentPage from "../pages/comment/CommentPage";
// import IndexNewsPage from "../pages/news/IndexNewsPage";
// import NewsPage from "../pages/news/NewsPage";

const MainPage = lazy(() => import("../pages/main/MainPage"));
const CategoryPage = lazy(() => import("../pages/category/CategoryPage"));
const ProductPage = lazy(() => import("../pages/product/ProductPage"));
const CartPage = lazy(() => import("../pages/cart/CartPage"));
const DeliveryPage = lazy(() => import("../pages/delivery/DeliveryPage"));
const OrderDonePage = lazy(() => import("../pages/order/OrderDonePage"));
const OrderPage = lazy(() => import("../pages/order/OrderPage"));
const AddCartPage = lazy(() => import("../pages/addcart/AddCartPage"));
const PagePage = lazy(() => import("../pages/page/PagePage"));
const PageFoundPage = lazy(() => import("../pages/pagefound/PageFoundPage"));
const ReturnProductPage = lazy(
  () => import("../pages/returnproduct/ReturnProductPage")
);
const SearchPage = lazy(() => import("../pages/search/SearchPage"));
const CommentPage = lazy(() => import("../pages/comment/CommentPage"));
const IndexNewsPage = lazy(() => import("../pages/news/IndexNewsPage"));
const NewsPage = lazy(() => import("../pages/news/NewsPage"));

export const useRoutes = (): ReactNode => {
  return (
    <Suspense
      fallback={
        <PageSceleton title={true}>
          <ProductListSceleton />
        </PageSceleton>
      }
    >
      <Switch>
        <Route exact path="/" component={MainPage} />
        <Route exact path="/category/:alias" component={CategoryPage} />
        <Route exact path="/product/:alias" component={ProductPage} />
        <Route exact path="/cart" component={CartPage} />
        <Route exact path="/delivery" component={DeliveryPage} />
        <Route exact path="/order/done" component={OrderDonePage} />
        <Route exact path="/order/:id" component={OrderPage} />
        <Route exact path="/addcart/:id" component={AddCartPage} />
        <Route exact path="/page/:alias" component={PagePage} />
        <Route exact path="/returnproduct" component={ReturnProductPage} />
        <Route exact path="/search" component={SearchPage} />
        <Route exact path="/comment" component={CommentPage} />
        <Route exact path="/news/:alias" component={NewsPage} />
        <Route exact path="/news" component={IndexNewsPage} />
        <Route path="*" component={PageFoundPage} />
      </Switch>
    </Suspense>
  );
};
