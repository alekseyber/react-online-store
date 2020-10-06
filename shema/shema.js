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
  getPvzListData,
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
  getProductsForCategoryData,
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
  # ----colors---
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
    _id: ID!
    sortValue: String!
    sortList: [SortList]!
  }
  # ----Brand---
  type Brand {
    _id: ID!
    title: String!
    img: String!
  }
  # ----Bagde---
  type Bagde {
    _id: ID!
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

  type FilterGrupp {
    alias: String!
    title: String!
    color: Boolean
    sizes: Boolean
    attrs: [FilterAttrs!]!
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

  type DeliveryInf {
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
    cityid: ID!
    status: Boolean
    errMsg: String
    city: City
    pvz: DeliveryInf
    courier: DeliveryInf
  }

  type PvzList {
    cityid: ID!
    pvz: [JSON]
  }
  # ----getTextReturnProduct, oferta---
  type Content {
    content: String
  }
  # ----products---
  type ProductLevel1 {
    level1_alias: ID!
    price: Int
    old_price: Int
    img: String
    level2: [String]!
  }

  type Product {
    alias: ID!
    title: String!
    product_model: Int!
    sku: String!
    price: Int!
    old_price: Int
    sizesgroupId: String!
    brand_id: String
    gender: String!
    color_default: String!
    level1Arr: [ProductLevel1]!
  }

  # ----ProductMain---

  type ProductFilterContent {
    cartpr1: [String]
    cartpr2: [String]
  }

  type Breadcrumb {
    text: String!
    disabled: Boolean!
    href: String!
    level: Int!
  }

  type ProductGal {
    imgs: [String]!
    level1_alias: ID!
  }

  type Meta {
    title: String
    description: String
    keywords: String
  }

  type ProductMain {
    alias: ID!
    content: String
    related: String
    filterContent: ProductFilterContent
    breadcrumbs: [Breadcrumb]
    level1: [ProductGal]
    meta: Meta
  }

  # ----productCartItem---

  type ProductForCart {
    alias: String!
    level1: String!
    level2: String!
    price: Int!
  }

  # ----Category---

  type CategoryContData {
    meta_title: String
    meta_description: String
    meta_keywords: String
    title: String
    htitle: String
    promo: String
    content: String
    breadcrumbs: [Breadcrumb]
  }

  type CategoryProduct {
    alias: String!
    # _id: String
    title: String
    update_at: Int
    price: Int
    filter: JSON
    level1: JSON
    level2: JSON
  }

  type CategoryProductsData {
    colors: JSON
    level2: JSON
    filter: JSON
    sortValue: String
    minPrice: Int
    maxPrice: Int
    countModif: Int
    countProduct: Int
    products: [CategoryProduct]
    productsFetch: [String]
  }

  type Category {
    alias: ID!
    contData: CategoryContData
    productsData: CategoryProductsData
    products: [Product]
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

  type MainPage {
    #id: String
    hitvisible: Boolean
    hitcount: Int
    hittitle: String
    topslidervisible: Boolean
    maincatalogvisible: Boolean
    maincatalogprefix: String
    maincatalogcount: Int
    promo: String
    content: String
    meta: Meta
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
  type ContentId {
    id: ID
    content: String
  }
  # ----News---
  type NewsItem {
    alias: String!
    img: String
    wtitle: Boolean
    annonce: String
    title: String!
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

  type SearchListData {
    searchAll: String!
    products: [SearchProductsList]
  }
  # ----searchFull---
  type SearchFullFilterSelected {
    color: [String]
  }

  type SearchFullFilter {
    count: Int
    selected: SearchFullFilterSelected
  }

  type SearchFull {
    preview: String
    filter: SearchFullFilter
    list: [String]
    products: [Product]
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
    brandItem(id: ID!): Brand
    bagde: [Bagde]
    bagdeItem(id: ID!): Bagde
    recomacces: Recomacces
    categoryTree: CategoryTree
    filterData: Filter
    deliveryData(cityid: Int): DeliveryData
    citySaerch(q: String!): [City]
    getPvz(cityid: Int!): PvzList
    textReturnProduct: Content
    product(alias: ID!): Product
    products(ids: [ID!]!): [Product]
    productMain(alias: ID!): ProductMain
    productCartItem(id: String!): ProductForCart
    category(alias: ID!, sortValue: String): Category
    hitData(count: Int): [String]
    mainPage: MainPage
    page(alias: ID!): Page
    oferta: Content
    sizesChart(sizesgroupId: ID!): ContentId
    newsList: [NewsItem]
    news(alias: ID!): News
    searchList(q: String!): SearchListData
    searchFull(q: String!): SearchFull
    comments: [Comment]!
    getOrder(id: ID!): Order
    getCupon(cuponText: String!): Cupon
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
    currency: String
  }

  input PvzSelect {
    index: Int
    cityid: Int
    Code: String
    Name: String
    Address: String
    WorkTime: String
    AddressComment: String
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
    cityObj: CityInput
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
    addComment(form: AddCommentMutationInput!): BaseMutationResponse
    addOrder(form: AddOrderMutationInput!): AddOrderMutationResponse
    addReturnProduct(form: ReturnProductMutationInput!): BaseMutationResponse
    addReturnCall(form: ReturnCallMutationInput!): BaseMutationResponse
  }
`;

const resolvers = {
  Mutation: {
    addComment: (_, { form }, { ip }) => addCommentData(form, ip),
    addOrder: (_, { form }, { ip }) => sentOrderData(form, ip),
    addReturnProduct: (_, { form }, { ip }) => returnProductFormData(form, ip),
    addReturnCall: (_, { form }, { ip }) => returnCallFormData(form, ip),
  },
  MutationResponse: {
    __resolveType(mutationResponse, context, info) {
      return null;
    },
  },
  JSON: GraphQLJSON,
  Category: {
    products: (parent) =>
      getProductsByIdsData("", true, true, parent.productsData.productsFetch),
  },
  MainPage: {
    hitData: (parent) => getProductsHitData(parent.hitcount, true),
  },
  SearchFull: {
    products: (parent) => getProductsByIdsData("", true, true, parent.list),
  },
  Recomacces: {
    products: (parent) => getProductsByIdsData("", true, true, parent.list),
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
    citySaerch: (_, { q }) => getCityData(q),
    getPvz: (_, { cityid }) => getPvzListData(cityid),
    textReturnProduct: () => getTextReturnProduct(),
    product: (_, { alias }) => getProductByAliasData(alias),
    products: (_, { ids }) => getProductsByIdsData("", true, true, ids),
    productMain: (_, { alias }) => getProductContentData(alias, true),
    productCartItem: (_, { id }) => getProductByLevelTooData(id),
    category: (_, { alias, sortValue }) =>
      getProductsForCategoryData(alias, sortValue),
    hitData: (_, { count }) => getProductsHitData(count, true),
    mainPage: () => getMainPageData(),
    page: (_, { alias }) => getPageByAlias(alias),
    oferta: () => getOfertaData(),
    sizesChart: (_, { sizesgroupId }) => getSizesChartData(sizesgroupId),
    newsList: () => getAllNewsData(),
    news: (_, { alias }) => getNewsByAliasData(alias, true),
    searchList: (_, { q }) => searchListData(q),
    searchFull: (_, { q }) => searchFullData(q, true),
    comments: () => getCommentAllData(),
    getOrder: (_, { id }) => fetchOrderByIdData(id),
    getCupon: (_, { cuponText }) => getCuponData(cuponText),
  },
};

module.exports = {
  typeDefs,
  resolvers,
};
