import { ReactNode, Suspense, lazy, LazyExoticComponent, FC } from "react";
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

interface IRoute {
  path: string;
  Element: LazyExoticComponent<FC<{}>>;
}

export enum RouteNames {
  MAIN_PAGE = "/",
  CATEGORY_PAGE = "/category/:alias",
  PRODUCT_PAGE = "/product/:alias",
  CART_PAGE = "/cart",
  DELIVERY_PAGE = "/delivery",
  ORDER_DONE_PAGE = "/order/done",
  ORDER_PAGE = "/order/:id",
  ADD_CART_PAGE = "/addcart/:id",
  PAGE_PAGE = "/page/:alias",
  RETURN_PRODUCT_PAGE = "/returnproduct",
  SEARCH_PAGE = "/search",
  COMMENT_PAGE = "/comment",
  NEWS_PAGE = "/news/:alias",
  INDEX_NEWS_PAGE = "/news",
  NO_FOUND_PAGE = "/404",
  PAGE_FOUND_PAGE = "*",
}

export const getLinkByRoutePath = (
  routeName: keyof typeof RouteNames,
  param: string = ""
): string => {
  return RouteNames[routeName].split(":")[0] + param;
};

const appRoutes: IRoute[] = [
  { path: RouteNames.MAIN_PAGE, Element: MainPage },
  { path: RouteNames.CATEGORY_PAGE, Element: CategoryPage },
  { path: RouteNames.PRODUCT_PAGE, Element: ProductPage },
  { path: RouteNames.CART_PAGE, Element: CartPage },
  { path: RouteNames.DELIVERY_PAGE, Element: DeliveryPage },
  { path: RouteNames.ORDER_DONE_PAGE, Element: OrderDonePage },
  { path: RouteNames.ORDER_PAGE, Element: OrderPage },
  { path: RouteNames.ADD_CART_PAGE, Element: AddCartPage },
  { path: RouteNames.PAGE_PAGE, Element: PagePage },
  { path: RouteNames.RETURN_PRODUCT_PAGE, Element: ReturnProductPage },
  { path: RouteNames.SEARCH_PAGE, Element: SearchPage },
  { path: RouteNames.COMMENT_PAGE, Element: CommentPage },
  { path: RouteNames.NEWS_PAGE, Element: NewsPage },
  { path: RouteNames.INDEX_NEWS_PAGE, Element: IndexNewsPage },
  { path: RouteNames.NO_FOUND_PAGE, Element: PageFoundPage },
  { path: RouteNames.PAGE_FOUND_PAGE, Element: PageFoundPage },
];

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
        {appRoutes.map(({ path, Element }) => (
          <Route path={path} element={<Element />} key={path} />
        ))}
      </Routes>
    </Suspense>
  );
};

// <Route path="/" element={<MainPage />} />
// <Route path="/category/:alias" element={<CategoryPage />} />
// <Route path="/product/:alias" element={<ProductPage />} />
// <Route path="/cart" element={<CartPage />} />
// <Route path="/delivery" element={<DeliveryPage />} />
// <Route path="/order/done" element={<OrderDonePage />} />
// <Route path="/order/:id" element={<OrderPage />} />
// <Route path="/addcart/:id" element={<AddCartPage />} />
// <Route path="/page/:alias" element={<PagePage />} />
// <Route path="/returnproduct" element={<ReturnProductPage />} />
// <Route path="/search" element={<SearchPage />} />
// <Route path="/comment" element={<CommentPage />} />
// <Route path="/news/:alias" element={<NewsPage />} />
// <Route path="/news" element={<IndexNewsPage />} />
// <Route path="*" element={<PageFoundPage />} />
