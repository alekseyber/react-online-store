import { gql } from "@apollo/client";

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

const PageBase = {
  fragments: {
    paramsData: gql`
      fragment PageBaseFragment on ParamsData {
        shop_name
      }
    `,
  },
};

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
  },
};

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

const CommentList = {
  fragments: {
    paramsData: gql`
      fragment CommentListFragment on ParamsData {
        count_page_comment
      }
    `,
  },
};

const IndexNewsPage = {
  fragments: {
    paramsData: gql`
      fragment IndexNewsPageFragment on ParamsData {
        count_page_news
      }
    `,
  },
};

export const PRODUCT_PAGE_QUERY = gql`
  query ProductPage($alias: ID!) {
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

export const APP_BAR_QUERY = gql`
  query AppBar {
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

export const TOP_BAR_QUERY = gql`
  query TopBar {
    paramsData @client {
      ...TopBarFragment
    }
  }
  ${TopBar.fragments.paramsData}
`;

export const APP_FOOTER_QUERY = gql`
  query AppFooter {
    paramsData @client {
      ...AppFooterFragment
    }
  }
  ${AppFooter.fragments.paramsData}
`;

export const PAGE_BASE_QUERY = gql`
  query PageBase {
    paramsData @client {
      ...PageBaseFragment
    }
  }
  ${PageBase.fragments.paramsData}
`;

export const CATEGORY_PAGE_QUERY = gql`
  query CategoryPage {
    filterData @client {
      ...CategoryPageFilterDataFragment
    }
  }
  ${CategoryPage.fragments.filterData}
`;

export const FILTER_QUERY = gql`
  query Filter {
    filterData @client {
      ...FilterFragment
    }
    categoryTree @client {
      ...FilterCategoryTreeFragment
    }
  }
  ${Filter.fragments.filterData}
  ${Filter.fragments.categoryTree}
`;

export const SORT_BTN_QUERY = gql`
  query SortBtn {
    sortData @client {
      ...SortBtnFragment
    }
  }
  ${SortBtn.fragments.sortData}
`;

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

export const ORDER_PAGE_QUERY = gql`
  query OrderPage($id: ID!) {
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

const MainPage = {
  fragments: {
    paramsData: gql`
      fragment MainPageFragment on ParamsData {
        categoryImgProperty
      }
    `,
  },
};

export const MAIN_PAGE_QUERY = gql`
  query MainPage {
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

export const ORDER_DONE_PAGE_QUERY = gql`
  query OrderDonePage {
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

export const RETURN_PRODUCT_PAGE_QUERY = gql`
  query ReturnProductPage {
    paramsData @client {
      ...ReturnProductPageFragment
    }
    textReturnProduct {
      content
    }
  }
  ${ReturnProductPage.fragments.paramsData}
`;

export const PRODUCTS_GRID_QUERY = gql`
  query ProductsGrid {
    paramsData @client {
      ...ProductBaseFragmentFragment
    }
  }
  ${ProductBaseFragment.fragments.paramsData}
`;

export const LIST_PRODUCT_QUERY = gql`
  query Products($ids: [ID]!) {
    products(ids: $ids) {
      ...ProductFragment
    }
  }
  ${ProductBaseFragment.fragments.product}
`;

export const PRODUCT_ITEM_QUERY = gql`
  query Product($alias: ID!) {
    product(alias: $alias) {
      ...ProductFragment
    }
  }
  ${ProductBaseFragment.fragments.product}
`;

export const CART_LIST_QUERY = gql`
  query CartList($ids: [ID]!) {
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

export const CART_ITEM_QUERY = gql`
  query Product($alias: ID!) {
    product(alias: $alias) @client {
      ...ProductFragment
    }
  }
  ${ProductBaseFragment.fragments.product}
`;

export const ADDED_CART_MODAL_QUERY = gql`
  query ProductsGrid {
    paramsData {
      currSymbol
    }
  }
`;

export const OFERTA_CONTENT_MODAL_QUERY = gql`
  query OfertaContentModal {
    oferta {
      content
    }
  }
`;
export const SIZE_CHART_CONTENT_QUERY = gql`
  query SizeChartContent($sizesgroupId: ID!) {
    sizesChart(sizesgroupId: $sizesgroupId) {
      sizesgroupId
      content
    }
  }
`;

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

export const DELIVERY_BANNERS_QUERY = gql`
  query DeliveryBanners {
    paramsData {
      ...DeliveryBannersFragment
    }
  }
  ${DeliveryBanners.fragments.paramsData}
`;

const DeliveryRegion = {
  fragments: {
    deliveryData: gql`
      fragment DeliveryRegionDeliveryDataFragment on DeliveryData {
        pvz {
          price
          deliveryPeriodMax
          deliveryPeriodMin
          deliveryDateMin
          deliveryDateMax
          priceByCurrency
        }
        courier {
          price
          deliveryPeriodMax
          deliveryPeriodMin
          deliveryDateMin
          deliveryDateMax
          priceByCurrency
        }
      }
    `,
  },
};

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
        ...DeliveryRegionDeliveryDataFragment
      }
      ${DeliveryRegion.fragments.deliveryData}
    `,
  },
};

export const DELIVERY_REZULT_QUERY = gql`
  query DeliveryRezult($cityid: Int!) {
    paramsData {
      ...DeliveryRezultFragment
    }
    deliveryData(cityid: $cityid) {
      ...DeliveryRezultDeliveryDataFragment
    }
  }
  ${DeliveryRezult.fragments.paramsData}
  ${DeliveryRezult.fragments.deliveryData}
`;

export const DELIVERY_REGION_QUERY = gql`
  query DeliveryRegion($cityid: Int!) {
    deliveryData(cityid: $cityid) {
      ...DeliveryRegionDeliveryDataFragment
    }
  }
  ${DeliveryRegion.fragments.deliveryData}
`;
