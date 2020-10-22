const { gql } = require("apollo-server-express");
const GraphQLJSON = require("graphql-type-json");

const {
  getParamsData,
  getColorGrupp,
  getColor,
  getSize,
  getSort,
  getBrand,
  getBagde,
  getRecomaccesData,
  getCategoryTree,
  getFilter,
  getTextReturnProduct,
} = require("../controllers_data/start.controller_data");

const {
  getCityData,
  getPvzListV2,
  getDeliveryData,
} = require("../controllers_data/delivery.controller_data");

const {
  getProductByAliasData,
  getProductsByIdsData,
  getProductsHitData,
  getProductContentData,
  getProductByLevelTooData,
} = require("../controllers_data/products.controller_data");

const {
  getCategoryData,
  getProductsForCategory,
} = require("../controllers_data/category.controller_data");

const {
  getMainPageData,
} = require("../controllers_data/mainpage.controller_data");

const {
  getPageByAlias,
  getOfertaData,
  getSizesChartData,
} = require("../controllers_data/page.controller_data");

const {
  getAllNewsData,
  getNewsByAliasData,
} = require("../controllers_data/news.controller_data");

const {
  searchListData,
  searchFullData,
} = require("../controllers_data/search.controller_data");

const {
  getCommentAllData,
  addCommentData,
} = require("../controllers_data/comment.controller_data");

const {
  sentOrderData,
  getCuponData,
  fetchOrderByIdData,
  returnProductFormData,
  returnCallFormData,
} = require("../controllers_data/order.controller_data");

const typeDefs = gql`
  scalar JSON
  # ----ParamsData---
  type BannersProduct {
    img: String!
    title: String!
    str1: String
    str2: String
    sortvalue: Int
    # _id: String
  }

  type ProductImgProperty {
    img_width: Int!
    img_height: Int
    status: String
    sortvalue: Int
    # _id: String
    path: String!
  }

  type BottomLinksListItem {
    icons: String!
    title: String!
    url: String!
    sortBottomLinks: Int
    # _id: String
  }

  type BottomLinks {
    title: String
    #_id: String
    list: [BottomLinksListItem]!
  }

  type TopLinks {
    icons: String
    title: String
    url: String
    sortTopLinks: Int
    #_id: String
  }

  type BannersDelivery {
    icons: String
    title: String
    str1: String
    str2: String
    sortvalue: Int
    #_id: String
  }

  type CacheTime {
    main: Int
    product: Int
    category: Int
    comment: Int
    news: Int
    page: Int
    start: Int
    categorytree: Int
  }

  type CityDefault {
    id: Int!
    cityName: String!
    oblName: String
  }

  type Phone {
    href: String!
    title: String!
  }

  type ParamsData @cacheControl(maxAge: 36000) {
    #_id: ID!
    shop_name: String!
    shop_name_rus: String
    shop_fullname_rus: String
    streetAddress: String
    shop_email: String
    count_page_product: Int!
    count_page_comment: Int!
    count_page_news: Int!
    textDeliveryProduct: String
    bannersProductOn: Boolean
    categoryImgProperty: String!
    logoimg: String!
    currSymbol: String
    currency: String
    defaultDeliveryText: String
    defaultDeliverySmallText: String
    orderDoneText: String
    orderPrintText: String
    defaultDeliveryRegionText: String
    maxDeliveryHourToday: Int
    qualityproductImg: Int!
    baseUrl: String
    visisbleTopBanner: Boolean
    timeCloseTopBanner: Int!
    bannersProduct: [BannersProduct]!
    productImgProperty: [ProductImgProperty]!
    bottomLinks: [BottomLinks]!
    topLinks: [TopLinks]!
    bannersDelivery: [BannersDelivery]!
    cacheTime: CacheTime!
    cityDefault: CityDefault!
    phone: Phone!
    #select: Boolean
  }
  # ----colors---
  type ColorGrupp @cacheControl(maxAge: 36000) {
    alias: ID!
    title: String!
    sortvalue: Int
    tags: String
    colorkey: String!
    children: [String]!
  }

  type Color {
    alias: ID!
    title: String!
    rustitle: String!
    colorkey: String!
  }
  # ----Size---
  type Size {
    alias: ID!
    tags: String
    title: String!
  }
  # ----sort---
  type SortList {
    order: Boolean!
    sort_default: Boolean!
    _id: String!
    text: String!
    field: String!
  }

  type SortData {
    sortValue: String!
    sortList: [SortList]!
  }
  # ----Brand---
  type Brand {
    brand_id: ID!
    title: String!
    img: String!
  }
  # ----Bagde---
  type Bagde {
    bagde_id: ID!
    colorkey: String
    title: String
  }
  # ----getCategoryTree---
  type CategoryTreeChilds {
    # _id: String
    img: String
    title: String!
    alias: String!
    parent_id: String
    childs: [CategoryTreeChilds]
  }

  type CategoryTree {
    # _id: ID!
    alias: ID!
    img: String
    title: String!
    parent_id: String!
    childs: [CategoryTreeChilds]!
  }

  # ----Filter---
  type FilterAttrs {
    title: String
    alias: String!
    tags: String
  }

  type FAttrs {
    title: String!
    alias: ID!
    tags: String
  }

  type FColorAttrs {
    alias: ID!
    colorGruppItem: ColorGrupp
  }
  type FSizesAttrs {
    alias: ID!
    sizeItem: Size
  }

  union FilterAttrsUnion = FAttrs | FColorAttrs | FSizesAttrs

  type FilterGrupp {
    alias: String!
    title: String!
    color: Boolean
    sizes: Boolean
    attrs: [FilterAttrsUnion!]!
  }

  type Filter {
    filterRezult: [FilterGrupp]!
    colorsChToGr: JSON
    colorsGrupp: JSON
    filterIndex: JSON
  }
  # ----deliveryData---
  type City {
    id: Int!
    cityName: String!
    oblName: String
  }

  type DeliveryInfCourier {
    price: String
    deliveryPeriodMin: Int
    deliveryPeriodMax: Int
    deliveryDateMin: String
    deliveryDateMax: String
    tariffId: Int
    priceByCurrency: Int
    currency: String
  }
  type DeliveryInfPvz {
    price: String
    deliveryPeriodMin: Int
    deliveryPeriodMax: Int
    deliveryDateMin: String
    deliveryDateMax: String
    tariffId: Int
    priceByCurrency: Int
    currency: String
  }

  type DeliveryData {
    cityid: Int!
    status: Boolean
    errMsg: String
    city: City
    pvz: DeliveryInfPvz
    courier: DeliveryInfCourier
  }
  # ----PVZ List---

  type PvzListItemLocation {
    country_code: String
    region_code: Int
    region: String
    city_code: Int
    city: String
    postal_code: String
    longitude: Float
    latitude: Float
    address: String
    address_full: String
  }

  type WorkTimeList {
    day: Int
    time: String
  }

  type OfficeImageList {
    url: String
  }

  type PvzListItemPhones {
    number: String
  }

  type PvzListItem {
    code: String
    name: String
    nearest_station: String
    work_time: String
    email: String
    type: String
    take_only: Boolean
    is_dressing_room: Boolean
    have_cashless: Boolean
    have_cash: Boolean
    allowed_cod: Boolean
    owner_ode: String
    fulfillment: Boolean
    location: PvzListItemLocation
    work_time_list: [WorkTimeList]
    office_image_list: [OfficeImageList]
    phones: [PvzListItemPhones]
  }

  type PvzList {
    cityid: Int!
    list: [PvzListItem]!
  }
  # ----DeliveryStart---
  type DeliveryStart {
    city: City
  }
  # ----getTextReturnProduct, oferta---
  type OfertaContent {
    content: String
  }
  type ReturnProductContent {
    content: String!
  }
  # ----products---

  type ProductLevel2 {
    alias: ID!
    sizeItem: Size
  }

  type ProductLevel1 {
    alias: ID!
    price: Int
    old_price: Int
    img: String
    level2: [ProductLevel2]!
    bagde_id: String
    bagdeItem: Bagde
    colorItem: Color
  }

  type Product {
    alias: ID!
    title: String!
    product_model: Int!
    sku: String!
    price: Int!
    old_price: Int
    sizesgroup_id: String!
    brand_id: String
    brandItem: Brand
    gender: String!
    color_default: String!
    level1Arr: [ProductLevel1]!
  }

  # ----ProductMain---

  type ProductFilterContent {
    cartpr1: [String]
    cartpr2: [String]
  }

  type BreadcrumbProduct {
    text: String!
    disabled: Boolean!
    href: String!
    level: Int!
  }

  type ProductGal {
    imgs: [String]!
    alias: ID!
  }

  type MetaProduct {
    title: String
    description: String
    keywords: String
  }

  type ProductMain {
    alias: ID!
    content: String
    related: String
    filter: ProductFilterContent
    breadcrumbsparrent: [BreadcrumbProduct]!
    level1GalArr: [ProductGal]!
    meta: MetaProduct!
  }
  # ----productCartItem---

  type ProductForCart {
    alias: String!
    level1: String!
    level2: String!
    price: Int!
  }

  # ----Category---

  type CategoryBreadcrumb {
    text: String!
    disabled: Boolean!
    href: String!
    level: Int!
  }

  type CategoryContData {
    meta_title: String
    meta_description: String
    meta_keywords: String
    title: String
    htitle: String
    promo: String
    content: String
    breadcrumbs: [CategoryBreadcrumb]
  }

  type CategoryProductsData {
    colors: JSON
    level2: JSON
    filter: JSON
    minPrice: Int
    maxPrice: Int
    countModif: Int
    countProduct: Int
  }

  type Category {
    alias: ID!
    contCategoryData: CategoryContData
    productsCategoryData: CategoryProductsData
  }
  # ----CategoryProductList---

  type CategoryProductLevelFilter {
    level1: JSON
    level2: JSON
  }
  type CategoryProduct {
    alias: String!
    title: String
    update_at: Int
    price: Int
    filterFilter: JSON
    level1Filter: CategoryProductLevelFilter
  }

  type CategoryProductList {
    alias: ID!
    sortValue: ID!
    productsList: [CategoryProduct]!
  }

  # ----MainPage---

  type Maincatalog {
    alias: String
    img: String
    title: String
  }

  type TopSlider {
    status: Boolean
    sortvalue: Int
    maxHeightBackground: Int
    imgLogo: String
    altLogo: String
    topString1: String
    topString2: String
    topString3: String
    topString4: String
    bottomString1: String
    bottomString2: String
    bottomString3: String
    bottomString4: String
    imgBackground: String
  }

  type MainBanner {
    visible: Boolean
    title: String
    description: String
    btnText: String
    btnLink: String
    imgBacgr: String
  }

  type MainPageMeta {
    title: String
    description: String
    keywords: String
  }
  type MainPage {
    hitvisible: Boolean
    hitcount: Int!
    hittitle: String
    topslidervisible: Boolean
    maincatalogvisible: Boolean
    maincatalogprefix: String
    maincatalogcount: Int
    promo: String
    content: String!
    meta: MainPageMeta!
    maincatalog: [Maincatalog]
    topSlider: TopSlider
    mainBanner: MainBanner
    hitData: [String]
  }
  # ----Page---
  type Page {
    alias: ID!
    title: String
    meta_title: String
    meta_description: String
    meta_keywords: String
    content: String
  }
  # ----sizesChart---
  type SizesChartContent {
    sizesgroupId: ID!
    content: String
  }
  # ----News---
  type NewsAnnonce {
    alias: String!
    img: String
    wtitle: Boolean
    annonce: String
    title: String!
  }

  type NewsList {
    list: [NewsAnnonce]!
  }

  type News {
    alias: ID
    title: String
    meta_title: String
    meta_description: String
    meta_keywords: String
    annonce: String
    content: String
  }
  # ----search---
  type SearchProductsList {
    title: String!
    link: String!
  }

  # ----searchFull---
  type SearchFullFilterSelected {
    color: [String]
  }

  type SearchFullProduct {
    alias: String!
    colorselect: String
  }

  type SearchFull {
    preview: String
    fetchList: [String]!
    list: [SearchFullProduct]!
  }
  # ----Comment---
  type Comment {
    authorName: String
    htmlstatus: Boolean
    commenText: String
    answer: String
    datas: String
    date: String
    id: String
  }
  type CommentList {
    list: [Comment]!
  }

  # ----getOrder---
  type OrderCartItem {
    title: String
    img: String
    link: String
    price: Int
    basePrice: Int
    qty: Int
    itemSumm: Int
    warning: String
    level1_alias: String
    level2_alias: String
    level1_id: String
    level2_id: String
    valid: Boolean
    product_id: String
  }

  type Order {
    id: ID
    orderNum: String!
    cityName: String
    payAwait: Boolean
    payStatus: Boolean
    orderStatus: String
    phone: String
    orderData: String
    summa: Int
    cart: [OrderCartItem]
  }
  # ----getCupon---
  type Cupon {
    value: Float!
    cuponId: String!
  }
  # ----Recomacces---
  type Recomacces {
    list: [String]
    products: [Product]
  }

  type CitySaerchItem {
    id: Int!
    cityName: String!
    oblName: String
  }

  # enum KeyRoot {
  #   MAIN
  # }

  type Query {
    paramsData: ParamsData
    colorGrupp: [ColorGrupp]
    colorGruppItem(alias: ID!): ColorGrupp
    color: [Color]
    colorItem(alias: ID!): Color
    size: [Size]
    sizeItem(alias: ID!): Size
    sortData: SortData
    brand: [Brand]
    brandItem(brand_id: ID!): Brand
    bagde: [Bagde]
    bagdeItem(bagde_id: ID!): Bagde
    recomacces: Recomacces
    categoryTree: CategoryTree
    filterData: Filter
    deliveryData(cityid: Int!): DeliveryData
    deliveryStart: DeliveryStart
    citySaerch(q: String!): [CitySaerchItem]!
    getPvz(cityid: Int!): PvzList
    textReturnProduct: ReturnProductContent!
    product(alias: ID!): Product
    products(ids: [ID]!): [Product]
    productMain(alias: ID!): ProductMain
    productCartItem(id: String!): ProductForCart
    hitData(count: Int!): [String]
    mainPage: MainPage
    page(alias: ID!): Page!
    oferta: OfertaContent
    sizesChart(sizesgroupId: ID!): SizesChartContent
    newsList: NewsList!
    news(alias: ID!): News!
    searchList(q: String!): [SearchProductsList]!
    searchFull(q: String): SearchFull
    comments: CommentList!
    order(id: ID!): Order
    getCupon(cuponText: String!): Cupon
    category(alias: ID!): Category
    productsCategory(alias: ID!, sortValue: String): CategoryProductList
  }
  #==============Mutation===================
  input AddCommentMutationInput {
    authorName: String!
    commenText: String!
    recaptchaToken: String!
  }
  interface MutationResponse {
    code: String!
    success: Boolean!
    message: String!
  }
  type BaseMutationResponse implements MutationResponse {
    code: String!
    success: Boolean!
    message: String!
  }
  # ----AddOrder---
  input CityInput {
    id: Int
    cityName: String
    oblName: String
  }
  input DeliveryInfInput {
    price: String
    deliveryPeriodMin: Int
    deliveryPeriodMax: Int
    deliveryDateMin: String
    deliveryDateMax: String
    tariffId: Int
    priceByCurrency: Int
    # currency: String
  }

  input PvzSelect {
    index: Int
    cityid: Int
    Code: String
    Name: String
    Address: String
    WorkTime: String
    AddressComment: String
    type: String
  }

  input DeliveryPrice {
    pvz: DeliveryInfInput
    courier: DeliveryInfInput
  }

  input Cart {
    idItem: String
    alias: String!
    level1: String!
    level2: String!
    price: Int
    qty: Int
  }
  input AddOrderMutationInput {
    name: String!
    phone: String!
    street: String
    house: String
    flat: String
    comment: String
    discontcupon: Float
    cupon: String
    pvzSelectStatus: Boolean
    deliverySelect: Int
    pvzSelect: PvzSelect
    deliveryPrice: DeliveryPrice
    cityObj: CityInput!
    cart: [Cart!]!
  }

  type OrderResponse {
    orderNum: String
    orderId: String
  }
  type AddOrderMutationResponse implements MutationResponse {
    code: String!
    success: Boolean!
    message: String!
    order: OrderResponse
  }
  # ----ReturnProduct---
  input ReturnProductMutationInput {
    action: Int
    phone: String!
    recaptchaToken: String!
  }
  # ----ReturnCall---
  input ReturnCallMutationInput {
    name: String
    phone: String!
    comment: String
    recaptchaToken: String!
  }
  #=========================================
  type Mutation {
    addComment(formData: AddCommentMutationInput!): BaseMutationResponse
    addOrder(formData: AddOrderMutationInput!): AddOrderMutationResponse
    addReturnProduct(
      formData: ReturnProductMutationInput!
    ): BaseMutationResponse
    addReturnCall(formData: ReturnCallMutationInput!): BaseMutationResponse
  }
`;

const resolvers = {
  Mutation: {
    addComment: (_, { formData }, { ip }) => addCommentData(formData, ip),
    addOrder: (_, { formData }, { ip }) => sentOrderData(formData, ip),
    addReturnProduct: (_, { formData }, { ip }) =>
      returnProductFormData(formData, ip),
    addReturnCall: (_, { formData }, { ip }) =>
      returnCallFormData(formData, ip),
  },
  MutationResponse: {
    __resolveType(mutationResponse, context, info) {
      return null;
    },
  },
  JSON: GraphQLJSON,
  // Category: {
  //   products: (parent) =>
  //     getProductsByIdsData("", true, true, parent.productsData.productsFetch),
  // },
  MainPage: {
    hitData: (parent) => getProductsHitData(parent.hitcount, true),
  },
  // SearchFull: {
  //   products: (parent) => getProductsByIdsData("", true, true, parent.list),
  // },
  Recomacces: {
    products: (parent) => getProductsByIdsData("", true, true, parent.list),
  },
  FilterAttrsUnion: {
    __resolveType(obj) {
      if (obj.title) {
        return "FAttrs";
      }
      if (obj.color) {
        return "FColorAttrs";
      }

      return "FSizesAttrs";
    },
  },

  Query: {
    paramsData: () => getParamsData(),
    colorGrupp: () => getColorGrupp(),
    colorGruppItem: (_, { alias }) => getColorGrupp(alias),
    color: () => getColor(),
    colorItem: (_, { alias }) => getColor(alias),
    size: () => getSize(),
    sizeItem: (_, { alias }) => getSize(alias),
    sortData: () => getSort(),
    brand: () => getBrand(),
    brandItem: (_, { id }) => getBrand(id),
    bagde: () => getBagde(),
    bagdeItem: (_, { id }) => getBagde(id),
    recomacces: () => getRecomaccesData(true),
    categoryTree: () => getCategoryTree(),
    filterData: () => getFilter(),
    deliveryData: (_, { cityid }, { ip }) => getDeliveryData(cityid, ip),
    deliveryStart: (_, __, { ip }) => getDeliveryData(0, ip, true),
    citySaerch: (_, { q }) => getCityData(q),
    getPvz: (_, { cityid }) => getPvzListV2(cityid),
    textReturnProduct: () => getTextReturnProduct(),
    product: (_, { alias }) => getProductByAliasData(alias),
    products: (_, { ids }) => getProductsByIdsData("", true, true, ids),
    productMain: (_, { alias }) => getProductContentData(alias, true),
    productCartItem: (_, { id }) => getProductByLevelTooData(id),
    hitData: (_, { count }) => getProductsHitData(count, true),
    mainPage: () => getMainPageData(),
    page: (_, { alias }) => getPageByAlias(alias),
    oferta: () => getOfertaData(),
    sizesChart: (_, { sizesgroupId }) => getSizesChartData(sizesgroupId),
    newsList: () => getAllNewsData(),
    news: (_, { alias }) => getNewsByAliasData(alias, true),
    searchList: (_, { q }) => searchListData(q),
    searchFull: (_, { q }) => searchFullData(q),
    comments: () => getCommentAllData(),
    order: (_, { id }) => fetchOrderByIdData(id),
    getCupon: (_, { cuponText }) => getCuponData(cuponText),
    productsCategory: (_, { alias, sortValue }) =>
      getProductsForCategory(alias, sortValue),
    category: (_, { alias }) => getCategoryData(alias),
  },
};

module.exports = {
  typeDefs,
  resolvers,
};
