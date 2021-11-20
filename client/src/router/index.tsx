import { ReactNode, Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
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
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/category/:alias" element={<CategoryPage />} />
        <Route path="/product/:alias" element={<ProductPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/delivery" element={<DeliveryPage />} />
        <Route path="/order/done" element={<OrderDonePage />} />
        <Route path="/order/:id" element={<OrderPage />} />
        <Route path="/addcart/:id" element={<AddCartPage />} />
        <Route path="/page/:alias" element={<PagePage />} />
        <Route path="/returnproduct" element={<ReturnProductPage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/comment" element={<CommentPage />} />
        <Route path="/news/:alias" element={<NewsPage />} />
        <Route path="/news" element={<IndexNewsPage />} />
        <Route path="*" element={<PageFoundPage />} />
      </Routes>
    </Suspense>
  );
};
