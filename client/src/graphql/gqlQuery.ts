import { gql } from "@apollo/client";
import { IFilterSelectGr } from "./localVarsFilter";
import { TLoadingBtn, TAlert, TError, TRecentlyViewed } from "./localVarsApp";
import {
  TCartData,
  ILastCart,
  IItemCartDataForAdd,
  ICuponData,
} from "./localVarsCart";
import { TDeliverySelect, TPvzSelect, ICity } from "./localVars";

import {
  TOrderDone,
  TReturnProductStatus,
  TCommentStatus,
  TReturnCallStatus,
} from "./localVarsOrder";

import { TModal } from "./localVarsModal";

export type TBreadcrumb = {
  text: string;
  disabled: boolean;
  href: string;
  level: number;
};

export type TTopLinks = {
  icons: string;
  title: string;
  url: string;
  sortTopLinks: number;
};

interface AppBarFragment {
  categoryImgProperty: string;
  logoimg: string;
  shop_name_rus: string;
  topLinks: TTopLinks[];
}

export type TCategoryTreeChilds = {
  alias: string;
  title: string;
  img: string;
  childs: TCategoryTreeChilds[];
};

export interface AppBarCategoryTreeFragment {
  alias: string;
  title: string;
  img: string;
  childs: TCategoryTreeChilds[];
}

const AppBar = {
  fragments: {
    paramsData: gql`
      fragment AppBarFragment on ParamsData {
        categoryImgProperty
        logoimg
        shop_name_rus
        topLinks {
          url
          icons
          title
          sortTopLinks
        }
      }
    `,
    categoryTree: gql`
      fragment AppBarCategoryTreeFragment on CategoryTree {
        alias
        title
        img
        childs {
          alias
          title
          img
          childs {
            alias
            title
            img
          }
        }
      }
    `,
  },
};

export type TPhone = {
  href: string;
  title: string;
};

interface TopBarFragment {
  phone: TPhone;
  topLinks: TTopLinks[];
}

const TopBar = {
  fragments: {
    paramsData: gql`
      fragment TopBarFragment on ParamsData {
        phone {
          href
          title
        }
        topLinks {
          url
          icons
          title
          sortTopLinks
        }
      }
    `,
  },
};

type BottomLinksListItem = {
  icons: string;
  title: string;
  url: string;
  sortBottomLinks: number;
};

type BottomLinks = {
  title: string;
  list: BottomLinksListItem[];
};

interface AppFooterFragment {
  shop_fullname_rus: string;
  phone: TPhone;
  topLinks: TTopLinks[];
  shop_email: string;
  streetAddress: string;
  bottomLinks: BottomLinks[];
}

const AppFooter = {
  fragments: {
    paramsData: gql`
      fragment AppFooterFragment on ParamsData {
        shop_fullname_rus
        phone {
          href
          title
        }
        shop_email
        streetAddress
        bottomLinks {
          title
          list {
            icons
            title
            url
            sortBottomLinks
          }
        }
      }
    `,
  },
};

interface PageBaseFragment {
  shop_name: string;
}

const PageBase = {
  fragments: {
    paramsData: gql`
      fragment PageBaseFragment on ParamsData {
        shop_name
      }
    `,
  },
};

export type FAttrs = {
  title: string;
  alias: string;
};

export type FColorAttrs = {
  alias: string;
  colorGruppItem: {
    title: string;
    colorkey: string;
  };
};

export type FSizesAttrs = {
  alias: string;
  sizeItem: {
    title: string;
  };
};

export interface IFilterGruppBase {
  alias: string;
  title: string;
  color: boolean;
  sizes: boolean;
}

export type TFAttrsItem = FAttrs | FColorAttrs | FSizesAttrs;

export interface IFilterGrupp extends IFilterGruppBase {
  attrs: TFAttrsItem[];
}

export interface FilterBaseFragmentFragment {
  filterRezult: IFilterGrupp[];
}

const FilterBaseFragment = {
  fragments: {
    filterData: gql`
      fragment FilterBaseFragmentFragment on Filter {
        filterRezult {
          alias
          title
          color
          sizes
          attrs {
            ... on FAttrs {
              title
              alias
              # tags
            }
            # @client
            ... on FColorAttrs @client {
              alias
              colorGruppItem {
                title
                colorkey
              }
            }
            ... on FSizesAttrs {
              alias
              sizeItem @client {
                title
              }
            }
          }
        }
      }
    `,
  },
};

interface FilterFragment extends FilterBaseFragmentFragment {}

interface FilterCategoryTreeFragment {
  alias: string;
}

const Filter = {
  fragments: {
    filterData: gql`
      fragment FilterFragment on Filter {
        ...FilterBaseFragmentFragment
      }
      ${FilterBaseFragment.fragments.filterData}
    `,
    categoryTree: gql`
      fragment FilterCategoryTreeFragment on CategoryTree {
        alias
      }
    `,
  },
};

export interface IFilterIndexL0 {
  height: number;
  color: number;
  floor: number;
  style: number;
  material: number;
  sizes: number;
}

export interface IFilterIndexL1 {
  [aliasAttr: string]: [number, number];
}

export type FilterIndex = [IFilterIndexL0, IFilterIndexL1];

export type ColorsGrupp = {
  [aliasAttr: string]: string[];
};

export type ColorsChToGr = {
  [aliasAttr: string]: string;
};

export interface CategoryPageFilterDataFragment
  extends FilterBaseFragmentFragment {
  filterIndex: FilterIndex;
  colorsGrupp: ColorsGrupp;
  colorsChToGr: ColorsChToGr;
}

type CategoryProductLevelFilter = {
  level1: {
    [aliasL1: string]: {
      [aliasL2: string]: string;
    };
  };
  level2: {
    [aliasL2: string]: string;
  };
};
export type ICategoryProduct = {
  alias: string;
  filterFilter: {
    [aliasAttr: string]: string;
  };
  level1Filter: CategoryProductLevelFilter;
};

export type ICategoryProductApplyFilter = {
  alias: string;
  colorselect: string;
};

interface ProductsCategoryFragment {
  alias: string;
  sortValue: string;
  productsList: ICategoryProduct[];
}

const CategoryPage = {
  fragments: {
    filterData: gql`
      fragment CategoryPageFilterDataFragment on Filter {
        ...FilterBaseFragmentFragment
        filterIndex
        colorsGrupp
        colorsChToGr
      }
      ${FilterBaseFragment.fragments.filterData}
    `,
    productsCategory: gql`
      fragment ProductsCategoryFragment on CategoryProductList {
        alias
        sortValue
        productsList {
          alias
          filterFilter
          level1Filter {
            level1
            level2
          }
        }
      }
    `,
  },
};

interface ISortListItem {
  _id: string;
  text: string;
}

interface SortBtnFragment {
  sortList: ISortListItem[];
}

const SortBtn = {
  fragments: {
    sortData: gql`
      fragment SortBtnFragment on SortData {
        sortList {
          _id
          text
        }
      }
    `,
  },
};

export type TProductImgProperty = {
  img_width: number;
  img_height?: number;
  status?: string;
  sortvalue?: number;
  path: string;
};

export interface ProductBaseForGrid {
  productImgProperty: TProductImgProperty[];
  qualityproductImg: number;
  currSymbol: string;
}

export interface ProductBaseFragmentFragment extends ProductBaseForGrid {
  count_page_product: number;
}

type Bagde = {
  bagde_id?: string;
  colorkey: string;
  title: string;
};

type Size = {
  alias?: string;
  tags?: string;
  title: string;
};

type Color = {
  alias: string;
  title: string;
  rustitle?: string;
  colorkey: string;
};

type Brand = {
  brand_id?: string;
  title: string;
  img: string;
};

export type TProductLevel2 = {
  alias: string;
  sizeItem: Size;
};

export type TProductLevel1 = {
  alias: string;
  price: number;
  old_price: number;
  img: string;
  level2: TProductLevel2[];
  bagde_id: string;
  bagdeItem: Bagde | null;
  colorItem: Color;
};

export interface ProductFragment {
  alias: string;
  title: string;
  brand_id: string;
  product_model: number;
  sku: string;
  price: number;
  old_price: number;
  sizesgroup_id: string;
  brandItem: Brand;
  gender: string;
  color_default: string;
  level1Arr: TProductLevel1[];
}

const ProductBaseFragment = {
  fragments: {
    paramsData: gql`
      fragment ProductBaseFragmentFragment on ParamsData {
        productImgProperty {
          path
          img_width
        }
        qualityproductImg
        currSymbol
        count_page_product
      }
    `,
    product: gql`
      fragment ProductFragment on Product {
        title
        brand_id
        alias
        product_model
        sku
        price
        old_price
        sizesgroup_id
        brandItem @client {
          title
          img
        }
        gender
        color_default
        level1Arr {
          alias
          price
          old_price
          img
          level2 {
            alias
            sizeItem @client {
              title
            }
          }
          bagde_id
          bagdeItem @client {
            colorkey
            title
          }
          colorItem @client {
            title
            colorkey
          }
        }
      }
    `,
  },
};

export interface IProductImgPropertySmall {
  path: string;
}

interface CartListParamsDataFragment {
  currSymbol: string;
  productImgProperty: IProductImgPropertySmall[];
}

const CartList = {
  fragments: {
    paramsData: gql`
      fragment CartListParamsDataFragment on ParamsData {
        currSymbol
        productImgProperty {
          path
        }
      }
    `,
  },
};

interface CartPageFragment {
  phone: TPhone;
  currSymbol: string;
  cityDefault: ICity;
}

interface CartPageCategoryTreeFragment {
  alias: string;
}

const CartPage = {
  fragments: {
    paramsData: gql`
      fragment CartPageFragment on ParamsData {
        phone {
          href
          title
        }
        currSymbol
        cityDefault {
          id
          cityName
          oblName
        }
      }
    `,
    categoryTree: gql`
      fragment CartPageCategoryTreeFragment on CategoryTree {
        alias
      }
    `,
  },
};

export type TBannersProduct = {
  img: string;
  title: string;
  str1: string;
  str2: string;
  sortvalue: number;
};
interface ProductPageParamsFragment extends ProductBaseFragmentFragment {
  bannersProduct: TBannersProduct[];
  bannersProductOn: boolean;
}

type ProductFilterContent = {
  cartpr1: string[];
  cartpr2: string[];
};

type ProductGal = {
  imgs: string[];
  alias: string;
};

type MetaProduct = {
  title: string;
  description: string;
  keywords: string;
};

export interface IProductContetntData {
  content: string;
  cartpr1: string[];
  cartpr2: string[];
}

export interface ProductMainPageProductFragment {
  alias: string;
  content: string;
  related: string;
  filter: ProductFilterContent;
  breadcrumbsparrent: TBreadcrumb[];
  level1GalArr: ProductGal[];
  meta: MetaProduct;
}

const ProductPage = {
  fragments: {
    paramsData: gql`
      fragment ProductPageParamsFragment on ParamsData {
        bannersProduct {
          img
          title
          str1
          str2
          sortvalue
        }
        bannersProductOn
        ...ProductBaseFragmentFragment
      }
      ${ProductBaseFragment.fragments.paramsData}
    `,
    product: gql`
      fragment ProductPageProductFragment on Product {
        ...ProductFragment
      }
      ${ProductBaseFragment.fragments.product}
    `,
    productMain: gql`
      fragment ProductMainPageProductFragment on ProductMain {
        alias
        content
        related
        filter {
          cartpr1
          cartpr2
        }
        breadcrumbsparrent {
          text
          disabled
          href
          level
        }
        level1GalArr {
          alias
          imgs
        }
        meta {
          title
          description
          keywords
        }
      }
    `,
  },
};

interface CommentListFragment {
  count_page_comment: number;
}

const CommentList = {
  fragments: {
    paramsData: gql`
      fragment CommentListFragment on ParamsData {
        count_page_comment
      }
    `,
  },
};

interface IndexNewsPageFragment {
  count_page_news: number;
}

const IndexNewsPage = {
  fragments: {
    paramsData: gql`
      fragment IndexNewsPageFragment on ParamsData {
        count_page_news
      }
    `,
  },
};

export interface IProductPageVars {
  alias: string;
}

export interface IProductPage {
  baseApiUrl: string;
  paramsData: ProductPageParamsFragment;
  product: ProductFragment;
  productMain: ProductMainPageProductFragment;
}

export const PRODUCT_PAGE_QUERY = gql`
  query ProductPage($alias: ID!) {
    baseApiUrl @client
    paramsData {
      ...ProductPageParamsFragment
    }
    product(alias: $alias) {
      ...ProductPageProductFragment
    }
    productMain(alias: $alias) {
      ...ProductMainPageProductFragment
    }
  }
  ${ProductPage.fragments.paramsData}
  ${ProductPage.fragments.product}
  ${ProductPage.fragments.productMain}
`;

export interface IErrorApp {
  error: TError;
}

export const ERROR_QUERY = gql`
  query ErrorApp {
    error @client
  }
`;

export interface IModalDialog {
  modalRootData: TModal;
}

export const MODAL_DIALOG_QUERY = gql`
  query ModalDialog {
    modalRootData @client
  }
`;

export interface IRecentlyViewed {
  recentlyViewed: TRecentlyViewed;
}

export const RECENTLY_VIEWED_QUERY = gql`
  query RecentlyViewed {
    recentlyViewed @client
  }
`;

interface SortData extends SortBtnFragment {
  sortValue: string;
}

export interface ILayout {
  deliveryStart: {
    city: ICity;
  };
  sortData: SortData;
}

export const LAYOUT_QUERY = gql`
  query Start {
    paramsData {
      ...TopBarFragment
      ...AppBarFragment
      ...AppFooterFragment
      ...PageBaseFragment
      ...ProductBaseFragmentFragment
      ...CartListParamsDataFragment
      ...CartPageFragment
      ...ProductPageParamsFragment
      ...CommentListFragment
      ...IndexNewsPageFragment
    }
    deliveryStart {
      city {
        id
        cityName
        oblName
      }
    }
    categoryTree {
      ...AppBarCategoryTreeFragment
    }
    filterData {
      ...CategoryPageFilterDataFragment
    }
    colorGrupp {
      alias
      title
      colorkey
    }
    color {
      alias
      title
      colorkey
    }
    size {
      alias
      title
    }
    sortData {
      sortValue
      ...SortBtnFragment
    }
    bagde {
      bagde_id
      title
      colorkey
    }
    brand {
      brand_id
      title
      img
    }
  }
  ${TopBar.fragments.paramsData}
  ${AppBar.fragments.paramsData}
  ${AppFooter.fragments.paramsData}
  ${PageBase.fragments.paramsData}
  ${CartList.fragments.paramsData}
  ${AppBar.fragments.categoryTree}
  ${CategoryPage.fragments.filterData}
  ${SortBtn.fragments.sortData}
  ${ProductBaseFragment.fragments.paramsData}
  ${CartPage.fragments.paramsData}
  ${ProductPage.fragments.paramsData}
  ${CommentList.fragments.paramsData}
  ${IndexNewsPage.fragments.paramsData}
`;

export interface IAppBar {
  baseApiUrl: string;
  paramsData: AppBarFragment;
  categoryTree: AppBarCategoryTreeFragment;
}

export const APP_BAR_QUERY = gql`
  query AppBar {
    baseApiUrl @client
    paramsData @client {
      ...AppBarFragment
    }
    categoryTree @client {
      ...AppBarCategoryTreeFragment
    }
  }
  ${AppBar.fragments.paramsData}
  ${AppBar.fragments.categoryTree}
`;

export interface ITopBar {
  cityNameCurrent: string;
  paramsData: TopBarFragment;
}

export const TOP_BAR_QUERY = gql`
  query TopBar {
    cityNameCurrent @client
    paramsData @client {
      ...TopBarFragment
    }
  }
  ${TopBar.fragments.paramsData}
`;

export interface IAppFooter {
  paramsData: AppFooterFragment;
}

export const APP_FOOTER_QUERY = gql`
  query AppFooter {
    paramsData @client {
      ...AppFooterFragment
    }
  }
  ${AppFooter.fragments.paramsData}
`;

export interface IPageBase {
  paramsData: PageBaseFragment;
}

export const PAGE_BASE_QUERY = gql`
  query PageBase {
    paramsData @client {
      ...PageBaseFragment
    }
  }
  ${PageBase.fragments.paramsData}
`;

type CategoryContData = {
  meta_title: string;
  meta_description: string;
  meta_keywords: string;
  title: string;
  htitle: string;
  promo?: string;
  content: string;
  breadcrumbs: TBreadcrumb[];
};

export interface ICategoryProductsData {
  colors: {
    [aliasL1: string]: string;
  };
  level2: {
    [aliasL2: string]: string;
  };
  filter: {
    [aliasAttr: string]: string;
  };
  minPrice?: number;
  maxPrice?: number;
  countModif?: number;
  countProduct?: number;
}

export interface ICategory {
  alias: string;
  contCategoryData: CategoryContData;
  productsCategoryData: ICategoryProductsData;
}

export interface ICategoryPage {
  filterData: CategoryPageFilterDataFragment;
  sortValue: string;
  category: ICategory;
  productsCategory: ProductsCategoryFragment;
}

export interface ICategoryPageVar {
  alias: string;
  sortValue?: string;
}

export const CATEGORY_PAGE_QUERY = gql`
  query CategoryPage($alias: ID!, $sortValue: String) {
    filterData {
      ...CategoryPageFilterDataFragment
    }
    sortValue @client @export(as: "sortValue")
    category(alias: $alias) {
      alias
      contCategoryData {
        meta_title
        meta_description
        meta_keywords
        title
        htitle
        # promo
        content
        breadcrumbs {
          text
          disabled
          level
          href
        }
      }
      productsCategoryData {
        colors
        level2
        filter
      }
    }
    productsCategory(alias: $alias, sortValue: $sortValue) {
      ...ProductsCategoryFragment
    }
  }
  ${CategoryPage.fragments.filterData}
  ${CategoryPage.fragments.productsCategory}
`;

export interface IFilter {
  filterData: FilterFragment;
  categoryTree: FilterCategoryTreeFragment;
  filterSelect: IFilterSelectGr;
}

export const FILTER_QUERY = gql`
  query Filter {
    filterData @client {
      ...FilterFragment
    }
    categoryTree @client {
      ...FilterCategoryTreeFragment
    }
    filterSelect @client
  }
  ${Filter.fragments.filterData}
  ${Filter.fragments.categoryTree}
`;

export interface IFilterSelect {
  filterSelect: IFilterSelectGr;
}

export const SELECT_FILTER_QUERY = gql`
  query FilterSelect {
    filterSelect @client
  }
`;

export interface ILoadingBtn {
  loadingBtn: TLoadingBtn;
}

export const LOADING_BTN_QUERY = gql`
  query LoadingBtn {
    loadingBtn @client
  }
`;

export interface ISortBtn {
  sortData: SortBtnFragment;
}

export const SORT_BTN_QUERY = gql`
  query SortBtn {
    sortData @client {
      ...SortBtnFragment
    }
  }
  ${SortBtn.fragments.sortData}
`;

export interface ICartPage {
  paramsData: CartPageFragment;
  categoryTree: CartPageCategoryTreeFragment;
}

export const CART_PAGE_QUERY = gql`
  query CartPage {
    paramsData @client {
      ...CartPageFragment
    }
    categoryTree @client {
      ...CartPageCategoryTreeFragment
    }
  }
  ${CartPage.fragments.paramsData}
  ${CartPage.fragments.categoryTree}
`;

type OrderCartItem = {
  title: string;
  img: string;
  link: string;
  price: number;
  qty: number;
  itemSumm: number;
  // basePrice: number;
  // warning: string;
  // level1_alias: string;
  // level2_alias: string;
  // level1_id: string;
  // level2_id: string;
  // valid: boolean;
  // product_id: string;
};

export type TOrder = {
  id: string;
  orderNum: string;
  cityName: string;
  payAwait?: boolean;
  payStatus?: boolean;
  orderStatus: string;
  phone: string;
  orderData: string;
  summa: number;
  cart: OrderCartItem[];
};

export interface IOrderPage {
  baseApiUrl: string;
  paramsData: {
    currSymbol: string;
  };
  order: TOrder;
}

export interface IOrderPageVar {
  id: string;
}

export const ORDER_PAGE_QUERY = gql`
  query OrderPage($id: ID!) {
    baseApiUrl @client
    paramsData @client {
      currSymbol
    }
    order(id: $id) {
      id
      orderNum
      cityName
      orderStatus
      phone
      orderData
      summa
      cart {
        title
        img
        link
        price
        qty
        itemSumm
      }
    }
  }
`;

interface MainPageFragment {
  categoryImgProperty: string;
}
const MainPage = {
  fragments: {
    paramsData: gql`
      fragment MainPageFragment on ParamsData {
        categoryImgProperty
      }
    `,
  },
};

export type TMaincatalog = {
  alias: string;
  img: string;
  title: string;
};

export type TTopSlider = {
  status?: boolean;
  sortvalue?: number;
  maxHeightBackground: number;
  imgLogo: string;
  altLogo: string;
  topString1: string;
  topString2: string;
  topString3: string;
  topString4?: string;
  bottomString1: string;
  bottomString2: string;
  bottomString3: string;
  bottomString4: string;
  imgBackground: string;
};

export type TMainBanner = {
  visible: boolean;
  title: string;
  description: string;
  btnText: string;
  btnLink: string;
  imgBacgr: string;
};

type MainPageMeta = {
  title: string;
  description: string;
  keywords: string;
};
type TMainPage = {
  hitvisible: boolean;
  hitcount: number;
  hittitle: string;
  topslidervisible: boolean;
  maincatalogvisible: boolean;
  maincatalogprefix: string;
  maincatalogcount: number;
  promo?: string;
  content: string;
  meta: MainPageMeta;
  maincatalog: TMaincatalog[];
  topSlider: TTopSlider;
  mainBanner: TMainBanner;
  hitData: string[];
};

export interface IMainPage {
  baseApiUrl: string;
  paramsData: MainPageFragment;
  mainPage: TMainPage;
}

export const MAIN_PAGE_QUERY = gql`
  query MainPage {
    baseApiUrl @client
    paramsData @client {
      ...MainPageFragment
    }
    mainPage {
      hitvisible
      hitcount
      hittitle
      topslidervisible
      maincatalogvisible
      maincatalogprefix
      maincatalogcount
      content
      meta {
        title
        description
        keywords
      }
      maincatalog {
        alias
        img
        title
      }
      topSlider {
        imgLogo
        altLogo
        topString1
        topString2
        topString3
        bottomString1
        bottomString2
        bottomString3
        bottomString4
        imgBackground
        maxHeightBackground
      }
      mainBanner {
        visible
        title
        description
        btnText
        btnLink
        imgBacgr
      }
      hitData
    }
  }
  ${MainPage.fragments.paramsData}
`;

export type TComment = {
  authorName: string;
  htmlstatus: boolean;
  commenText: string;
  answer: string;
  date: string;
};
interface ICommentList  {
  list: TComment[];
};

export interface IComment {
  paramsData: CommentListFragment;
  comments: ICommentList;
}
export const COMMENT_LIST_QUERY = gql`
  query CommentList {
    paramsData @client {
      ...CommentListFragment
    }
    comments {
      list {
        authorName
        htmlstatus
        commenText
        answer
        date
      }
    }
  }
  ${CommentList.fragments.paramsData}
`;

export type TNewsAnnonce = {
  alias: string;
  img: string;
  wtitle: boolean;
  annonce: string;
  title: string;
};

type TNewsList = {
  list: TNewsAnnonce[];
};

export interface IIndexNewsPage {
  paramsData: IndexNewsPageFragment;
  newsList: TNewsList;
}

export const INDEX_NEWS_PAGE_QUERY = gql`
  query IndexNewsPage {
    paramsData @client {
      ...IndexNewsPageFragment
    }
    newsList {
      list {
        alias
        title
        annonce
      }
    }
  }
  ${IndexNewsPage.fragments.paramsData}
`;

interface OrderDonePageFragment {
  orderDoneText: string;
  baseUrl: string;
}

const OrderDonePage = {
  fragments: {
    paramsData: gql`
      fragment OrderDonePageFragment on ParamsData {
        orderDoneText
        baseUrl
      }
    `,
  },
};

export interface IOrderDonePage {
  baseApiUrl: string;
  orderDone: TOrderDone;
  paramsData: OrderDonePageFragment;
}

export const ORDER_DONE_PAGE_QUERY = gql`
  query OrderDonePage {
    baseApiUrl @client
    orderDone @client
    paramsData {
      ...OrderDonePageFragment
    }
  }
  ${OrderDonePage.fragments.paramsData}
`;

const ReturnProductPage = {
  fragments: {
    paramsData: gql`
      fragment ReturnProductPageFragment on ParamsData {
        phone {
          href
          title
        }
      }
    `,
  },
};

type ReturnProductContent = {
  content: string;
};

export interface IReturnProductPage {
  paramsData: {
    phone: TPhone;
  };
  textReturnProduct: ReturnProductContent;
  returnProductStatus: TReturnProductStatus;
}

export const RETURN_PRODUCT_PAGE_QUERY = gql`
  query ReturnProductPage {
    paramsData @client {
      ...ReturnProductPageFragment
    }
    textReturnProduct {
      content
    }
    returnProductStatus @client
  }
  ${ReturnProductPage.fragments.paramsData}
`;

export interface ICommentAdd {
  commentStatus: TCommentStatus;
}

export const COMMENT_ADD_QUERY = gql`
  query CommentAdd {
    commentStatus @client
  }
`;

export interface IReturnCall {
  returnCallStatus: TReturnCallStatus;
}

export const RETURN_CALL_QUERY = gql`
  query ReturnCall {
    returnCallStatus @client
  }
`;

export interface IProductsGrid {
  paramsData: ProductBaseFragmentFragment;
}

export const PRODUCTS_GRID_QUERY = gql`
  query ProductsGrid {
    paramsData @client {
      ...ProductBaseFragmentFragment
    }
  }
  ${ProductBaseFragment.fragments.paramsData}
`;

export interface IProducts {
  products: ProductFragment;
}
export interface IProductsVar {
  ids: string[];
}

export const LIST_PRODUCT_QUERY = gql`
  query Products($ids: [ID]!) {
    products(ids: $ids) {
      ...ProductFragment
    }
  }
  ${ProductBaseFragment.fragments.product}
`;

export interface IProductVar {
  alias: string;
}

export type TStateSelectColor = string | null | undefined;

export interface IProduct {
  baseApiUrl: string;
  stateSelectColor: TStateSelectColor;
  product: ProductFragment;
}
export const PRODUCT_ITEM_QUERY = gql`
  query Product($alias: ID!) {
    baseApiUrl @client
    stateSelectColor(alias: $alias) @client
    product(alias: $alias) {
      ...ProductFragment
    }
  }
  ${ProductBaseFragment.fragments.product}
`;

export interface ICartList {
  baseApiUrl: string;
  cartData: TCartData;
  cartDataIds: string[];
  paramsData: CartListParamsDataFragment;
  products: ProductFragment[];
}

export const CART_LIST_QUERY = gql`
  query CartList($ids: [ID]!) {
    baseApiUrl @client
    cartData @client
    cartDataIds @client @export(as: "ids")
    paramsData @client {
      ...CartListParamsDataFragment
    }
    products(ids: $ids) {
      ...ProductFragment
    }
  }
  ${CartList.fragments.paramsData}
  ${ProductBaseFragment.fragments.product}
`;

// export const CART_ITEM_QUERY = gql`
//   query Product($alias: ID!) {
//     product(alias: $alias) @client {
//       ...ProductFragment
//     }
//   }
//   ${ProductBaseFragment.fragments.product}
// `;

export interface IAddedCart {
  lastCart: ILastCart;
  paramsData: {
    currSymbol: string;
  };
}

export const ADDED_CART_MODAL_QUERY = gql`
  query AddedCart {
    lastCart @client
    paramsData {
      currSymbol
    }
  }
`;

export interface ICartData {
  cartData: TCartData;
}

export const CART_DATA_QUERY = gql`
  query CartData {
    cartData @client
  }
`;

export interface IUseCartSumm {
  cartData: TCartData;
  discontcupon: number;
}

export const USE_CART_SUMM_QUERY = gql`
  query useCartSumm {
    cartData @client
    discontcupon @client
  }
`;

type TCupon = {
  value: number;
  cuponId: string;
};

export interface IGetCupon {
  getCupon: TCupon;
}

export interface IGetCuponVar {
  cuponText: string;
}

export const CART_ADD_CUPON_QUERY = gql`
  query GetCupon($cuponText: String!) {
    getCupon(cuponText: $cuponText) {
      value
      cuponId
    }
  }
`;

export interface ISelectSize {
  selectSize: null | string;
}

export interface ISelectSizeVar {
  alias: string;
}

export const SELECT_SIZE_QUERY = gql`
  query SelectSize($alias: String!) {
    selectSize(alias: $alias) @client
  }
`;

export interface ISelectColor {
  stateSelectColor: null | string;
}

export interface ISelectColorVar {
  alias: string;
}

export const SELECT_COLOR_QUERY = gql`
  query SelectColor($alias: String!) {
    stateSelectColor(alias: $alias) @client
  }
`;

export interface IOfertaContentModal {
  oferta: {
    content: string;
  };
}

export const OFERTA_CONTENT_MODAL_QUERY = gql`
  query OfertaContentModal {
    oferta {
      content
    }
  }
`;

export interface ICartAddPage {
  productCartItem: IItemCartDataForAdd;
}

export interface ICartAddPageVar {
  id: string;
}

export const CART_ADD_PAGE_QUERY = gql`
  query CartAddPage($id: String!) {
    productCartItem(id: $id) {
      alias
      level1
      level2
      price
    }
  }
`;

export interface ISizeChartContent {
  sizesChart: {
    sizesgroupId: string;
    content: string;
  };
}

export interface ISizeChartContentVar {
  sizesgroupId: string;
}

export const SIZE_CHART_CONTENT_QUERY = gql`
  query SizeChartContent($sizesgroupId: ID!) {
    sizesChart(sizesgroupId: $sizesgroupId) {
      sizesgroupId
      content
    }
  }
`;

export type TSearchFullProduct = {
  alias: string;
  colorselect?: string;
};

type SearchFull = {
  preview: string;
  fetchList: string[];
  list: TSearchFullProduct[];
};

export interface ISearchFull {
  searchFull: SearchFull;
}

export interface ISearchFullVar {
  q: string;
}

export const SEARCH_FULL_QUERY = gql`
  query SearchFull($q: String) {
    searchFull(q: $q) {
      preview
      fetchList
      list {
        alias
        colorselect
      }
    }
  }
`;

export type TSearchProductsList = {
  title: string;
  link: string;
};

export interface ISearch {
  searchList: TSearchProductsList[];
}

export interface ISearchVar {
  q: string;
}

export const SEARCH_QUERY = gql`
  query Search($q: String!) {
    searchList(q: $q) {
      title
      link
    }
  }
`;

type News = {
  alias: string;
  title: string;
  meta_title: string;
  meta_description: string;
  meta_keywords: string;
  annonce?: string;
  content: string;
};

export interface INewsPageVar {
  alias: string;
}

export interface INewsPage {
  news: News;
}

export const NEWS_PAGE_QUERY = gql`
  query NewsPage($alias: ID!) {
    news(alias: $alias) {
      title
      alias
      meta_title
      meta_description
      meta_keywords
      content
    }
  }
`;

type Page = {
  alias: string;
  title: string;
  meta_title: string;
  meta_description: string;
  meta_keywords: string;
  content: string;
};

export interface IPagePageVar {
  alias: string;
}

export interface IPagePage {
  page: Page;
}

export const PAGE_PAGE_QUERY = gql`
  query PagePage($alias: ID!) {
    page(alias: $alias) {
      title
      alias
      meta_title
      meta_description
      meta_keywords
      content
    }
  }
`;

type BannersDelivery = {
  icons: string;
  title: string;
  str1: string;
  str2: string;
  sortvalue?: number;
};

interface DeliveryBannersFragment {
  bannersDelivery: BannersDelivery[];
}

const DeliveryBanners = {
  fragments: {
    paramsData: gql`
      fragment DeliveryBannersFragment on ParamsData {
        bannersDelivery {
          icons
          title
          str1
          str2
        }
      }
    `,
  },
};

export interface IDeliveryBanners {
  paramsData: DeliveryBannersFragment;
}

export const DELIVERY_BANNERS_QUERY = gql`
  query DeliveryBanners {
    paramsData {
      ...DeliveryBannersFragment
    }
  }
  ${DeliveryBanners.fragments.paramsData}
`;

export type DeliveryInf = {
  price: string;
  deliveryPeriodMin: number;
  deliveryPeriodMax: number;
  deliveryDateMin: string;
  deliveryDateMax: string;
  tariffId: number;
  priceByCurrency: number;
  // currency?: string;
};

interface DeliveryRezultFragment {
  cityDefault: ICity;
  defaultDeliveryText: string;
  defaultDeliveryRegionText: string;
  maxDeliveryHourToday: number;
  currSymbol: string;
  textDeliveryProduct: string;
}

export interface DeliveryRezultDeliveryDataFragment {
  cityid: number;
  status: boolean;
  errMsg: string;
  city: ICity;
  pvz: DeliveryInf;
  courier: DeliveryInf;
}

const DeliveryRezult = {
  fragments: {
    paramsData: gql`
      fragment DeliveryRezultFragment on ParamsData {
        cityDefault {
          id
          cityName
          oblName
        }
        defaultDeliveryText
        defaultDeliveryRegionText
        maxDeliveryHourToday
        currSymbol
        textDeliveryProduct
      }
    `,
    deliveryData: gql`
      fragment DeliveryRezultDeliveryDataFragment on DeliveryData {
        cityid
        status
        errMsg
        pvz {
          price
          deliveryPeriodMax
          deliveryPeriodMin
          deliveryDateMin
          deliveryDateMax
          priceByCurrency
          tariffId
        }
        courier {
          price
          deliveryPeriodMax
          deliveryPeriodMin
          deliveryDateMin
          deliveryDateMax
          priceByCurrency
          tariffId
        }
      }
    `,
  },
};

export interface IAppForm {
  deliverySelect: TDeliverySelect;
  googleReKey: string;
}

export const APP_FORM_QUERY = gql`
  query AppForm {
    deliverySelect @client
    googleReKey @client
  }
`;

export interface IDeliveryCityCarrent {
  cityNameCurrent: string;
}

export const DELIVERY_CITY_CARRENT_QUERY = gql`
  query DeliveryCityCarrent {
    cityNameCurrent @client
  }
`;

export interface IDeliveryPvzDescrNoProps {
  pvzSelect: TPvzSelect;
}

export const DELIVERY_PVZ_DESCR_NO_PROPS_QUERY = gql`
  query DeliveryPvzDescrNoProps {
    pvzSelect @client
  }
`;

export interface IDeliveryCityInputVar {
  q: string;
}

export interface IDeliveryCityInput {
  citySaerch: ICity[];
}

export const DELIVERY_CITY_INPUT_QUERY = gql`
  query DeliveryCityInput($q: String!) {
    citySaerch(q: $q) {
      id
      cityName
      oblName
    }
  }
`;

export interface IUseAddOrder {
  cityIdCurrent: number;
  deliveryData: DeliveryRezultDeliveryDataFragment;
  pvzSelect: TPvzSelect;
  deliverySelect: TDeliverySelect;
  cartData: TCartData;
  cuponData: ICuponData;
  cityCurrent: ICity;
}

export const USE_ADD_ORDER_QUERY = gql`
  query UseAddOrder($cityid: Int!) {
    cityIdCurrent @client @export(as: "cityid")
    deliveryData(cityid: $cityid) {
      ...DeliveryRezultDeliveryDataFragment
    }
    pvzSelect @client
    deliverySelect @client
    cartData @client
    cuponData @client
    cityCurrent @client
  }
  ${DeliveryRezult.fragments.deliveryData}
`;

export interface IDeliveryRezult {
  paramsData: DeliveryRezultFragment;
  deliverySelect: TDeliverySelect;
  cityIdCurrent: number;
  deliveryData: DeliveryRezultDeliveryDataFragment;
}

export const DELIVERY_REZULT_QUERY = gql`
  query DeliveryRezult($cityid: Int!) {
    paramsData {
      ...DeliveryRezultFragment
    }
    deliverySelect @client
    cityIdCurrent @client @export(as: "cityid")
    deliveryData(cityid: $cityid) {
      ...DeliveryRezultDeliveryDataFragment
    }
  }
  ${DeliveryRezult.fragments.paramsData}
  ${DeliveryRezult.fragments.deliveryData}
`;

export interface IDeliveryPvzSelComp {
  pvzSelect: TPvzSelect;
}

export const DELIVERY_PVZ_SEL_COMP_QUERY = gql`
  query DeliveryPvzSelComp {
    pvzSelect @client
  }
`;

export interface IBaseApiUrl {
  baseApiUrl: string;
}

export const BASE_API_URL_QUERY = gql`
  query BaseApiUrl {
    baseApiUrl @client
  }
`;

export interface IAlert {
  alert: TAlert;
}
export const ALERT_QUERY = gql`
  query Alert {
    alert @client
  }
`;

type PvzListItemLocation = {
  longitude: number;
  latitude: number;
  address: string;
};

type PvzListItemPhones = {
  number: string;
};

export type TPvzListItem = {
  code: string;
  name: string;
  nearest_station: string;
  work_time: string;
  type: string;
  location: PvzListItemLocation;
  phones: PvzListItemPhones[];
};

type PvzList = {
  cityid: number;
  list: TPvzListItem[];
};

export interface IDeliveryPvzSelector {
  yaMapKey: string;
  cityIdCurrent: number;
  getPvz: PvzList;
}

export const DELIVERY_PVZ_SELECTOR_QUERY = gql`
  query DeliveryPvzSelector($cityid: Int!) {
    yaMapKey @client
    cityIdCurrent @client @export(as: "cityid")
    getPvz(cityid: $cityid) {
      cityid
      list {
        code
        name
        nearest_station
        location {
          address
          longitude
          latitude
        }
        work_time
        type
        phones {
          number
        }
      }
    }
  }
`;
