import { ApolloClient, InMemoryCache } from "@apollo/client";
import {
  sortValueVar,
  cityСurrentVar,
  pvzSelectVar,
  deliverySelectVar,
  googleReKeyVar,
  yaMapKeyVar,
  baseApiUrlVar,
} from "./graphql/localVars";

import { alertVar, recentlyViewedVar, errorVar } from "./graphql/localVarsApp";

import { modalRootDataVar } from "./graphql/localVarsModal";

import {
  productSelectVar,
  cartDataVar,
  lastCartVar,
  cuponDataVar,
} from "./graphql/localVarsCart";

import { filterSelectVar } from "./graphql/localVarsFilter";

const baseApiUrl = () => {
  if (process.env.REACT_APP_API_URL) {
    return process.env.REACT_APP_API_URL;
  }
  return process.env.NODE_ENV !== "production" ? "http://localhost:5000" : "";
};

const BASE_API_URL = baseApiUrl();

const uri = `${BASE_API_URL}/api/graphql`;

export const cache = new InMemoryCache({
  possibleTypes: {
    ParamsData: [
      "BannersProduct",
      "ProductImgProperty",
      "BottomLinks",
      "TopLinks",
      "BannersDelivery",
      "CacheTime",
      "CityDefault",
      "Phone",
    ],
    BottomLinks: ["BottomLinksListItem"],
    SortData: ["SortList"],
    CategoryTree: ["CategoryTreeChilds"],
    CategoryTreeChilds: ["CategoryTreeChilds"],
    Filter: ["FilterGrupp"],
    FilterGrupp: ["FAttrs", "FColorAttrs", "FSizesAttrs"],
    DeliveryData: ["City", "DeliveryInfPvz", "DeliveryInfCourier"],
    Product: ["ProductLevel1", "Brand"],
    ProductLevel1: ["Bagde", "Color", "ProductLevel2"],
    ProductLevel2: ["Size"],
    ProductMain: [
      "ProductFilterContent",
      "BreadcrumbProduct",
      "ProductGal",
      "MetaProduct",
    ],
    CategoryProductList: ["CategoryProduct"], //Category
    CategoryProduct: ["CategoryProductLevelFilter"], //Category
    Category: ["CategoryContData", "CategoryProductsData"], //Category
    CategoryContData: ["CategoryBreadcrumb"],
    MainPage: ["Maincatalog", "TopSlider", "MainBanner", "MainPageMeta"],
    SearchListData: ["SearchProductsList"],
    SearchFull: ["SearchFullProduct"],
    SearchFullFilter: ["SearchFullFilterSelected"],
    Order: ["OrderCartItem"],
    Recomacces: ["Product"],
    FColorAttrs: ["ColorGrupp"],
    FSizesAttrs: ["Size"],
    CommentList: ["Comment"],
    NewsList: ["NewsAnnonce"],
    PvzList: ["PvzListItem"],
    PvzListItem: [
      "PvzListItemLocation",
      "WorkTimeList",
      "OfficeImageList",
      "PvzListItemPhones",
    ],
  },
  typePolicies: {
    CategoryProductList: {
      keyFields: ["alias", "sortValue"],
    },
    Category: {
      keyFields: ["alias"],
    },
    ParamsData: {
      keyFields: [],
    },
    SortData: {
      keyFields: [],
    },
    DeliveryData: {
      keyFields: ["cityid"],
    },
    PvzList: {
      keyFields: ["cityid"],
    },
    DeliveryStart: {
      keyFields: [],
    },
    OfertaContent: {
      keyFields: [],
    },
    ReturnProductContent: {
      keyFields: [],
    },
    ProductMain: {
      keyFields: ["alias"],
    },
    MainPage: {
      keyFields: [],
    },
    SizesChartContent: {
      keyFields: ["sizesgroupId"],
    },
    CommentList: {
      keyFields: [],
    },
    NewsList: {
      keyFields: [],
    },
    Product: {
      keyFields: ["alias"],
      fields: {
        brandItem(_, { readField, toReference }) {
          const brand_id = readField("brand_id");
          return toReference({
            __typename: "Brand",
            brand_id,
          });
        },
      },
    },
    ProductLevel1: {
      fields: {
        colorItem(_, { readField, toReference }) {
          const alias = readField("alias");
          return toReference({
            __typename: "Color",
            alias,
          });
        },
        bagdeItem(_, { readField, toReference }) {
          const bagde_id = readField("bagde_id");
          if (!bagde_id) {
            return null;
          }
          return toReference({
            __typename: "Bagde",
            bagde_id,
          });
        },
      },
    },
    ProductLevel2: {
      fields: {
        sizeItem(_, { readField, toReference }) {
          const alias = readField("alias");
          return toReference({
            __typename: "Size",
            alias,
          });
        },
      },
    },
    Cupon: {
      keyFields: [],
    },
    News: {
      keyFields: ["alias"],
    },
    Page: {
      keyFields: ["alias"],
    },
    ColorGrupp: {
      keyFields: ["alias"],
    },
    Color: {
      keyFields: ["alias"],
    },
    Size: {
      keyFields: ["alias"],
    },
    Brand: {
      keyFields: ["brand_id"],
    },
    Bagde: {
      keyFields: ["bagde_id"],
    },
    Order: {
      keyFields: ["id"],
    },
    SearchFull: {
      keyFields: [],
    },
    Query: {
      fields: {
        filterSelect: {
          read() {
            return filterSelectVar();
          },
        },
        cartData: {
          read() {
            return cartDataVar();
          },
        },
        cartDataIds: {
          read() {
            const cartData = cartDataVar();
            const cartIdsObj = {};
            cartData.forEach((el) => {
              if (!cartData[el.alias]) {
                cartIdsObj[el.alias] = 1;
              }
            });
            return Object.keys(cartIdsObj);
          },
        },
        lastCart: {
          read() {
            return lastCartVar();
          },
        },
        cuponData: {
          read() {
            return cuponDataVar();
          },
        },
        discontcupon: {
          read() {
            const cuponData = cuponDataVar();
            return cuponData.discontcupon;
          },
        },
        modalRootData: {
          read() {
            return modalRootDataVar();
          },
        },
        alert: {
          read() {
            return alertVar();
          },
        },
        recentlyViewed: {
          read() {
            return recentlyViewedVar();
          },
        },
        error: {
          read() {
            return errorVar();
          },
        },

        deliverySelect: {
          read() {
            return deliverySelectVar();
          },
        },
        pvzSelect: {
          read() {
            const pvzSelect = pvzSelectVar();
            const cityСurrent = cityСurrentVar();
            if (pvzSelect && cityСurrent) {
              if (pvzSelect.cityid === cityСurrent.id) {
                return pvzSelect;
              }
            }
            return null;
          },
        },
        googleReKey: {
          read() {
            return googleReKeyVar();
          },
        },
        yaMapKey: {
          read() {
            return yaMapKeyVar();
          },
        },
        baseApiUrl: {
          read() {
            return baseApiUrlVar();
          },
        },
        sortValue: {
          read() {
            return sortValueVar();
          },
        },
        cityNameCurrent: {
          read() {
            const cityСurrent = cityСurrentVar();
            if (cityСurrent.cityName) return cityСurrent.cityName;
            return "Москва";
          },
        },
        cityIdCurrent: {
          read() {
            const cityСurrent = cityСurrentVar();
            if (cityСurrent.id) return cityСurrent.id;
            return 44;
          },
        },
        selectSize: {
          read(_, { args }) {
            const productSelect = productSelectVar();
            if (args.alias) {
              if (productSelect.level2[args.alias]) {
                return productSelect.level2[args.alias];
              }
            }
            return null;
          },
        },
        stateSelectColor: {
          read(_, { args }) {
            const productSelect = productSelectVar();
            if (args.alias) {
              if (productSelect.level1[args.alias]) {
                return productSelect.level1[args.alias];
              }
            }
            return null;
          },
        },
        product(_, { args, toReference }) {
          return toReference({
            __typename: "Product",
            alias: args.alias,
          });
        },

        category(_, { args, toReference }) {
          return toReference({
            __typename: "Category",
            alias: args.alias,
          });
        },
        // colorGruppItem(_, { args, toReference }) {
        //   return toReference({
        //     __typename: "ColorGrupp",
        //     alias: args.alias,
        //   });
        // },
        productsCategory(_, { args, toReference }) {
          return toReference({
            __typename: "CategoryProductList",
            alias: args.alias,
            sortValue: args.sortValue,
          });
        },
      },
    },
    FColorAttrs: {
      fields: {
        colorGruppItem(_, { readField, toReference }) {
          const alias = readField("alias");
          return toReference({
            __typename: "ColorGrupp",
            alias,
          });
        },
      },
    },
    FSizesAttrs: {
      fields: {
        sizeItem(_, { readField, toReference }) {
          const alias = readField("alias");
          return toReference({
            __typename: "Size",
            alias,
          });
        },
      },
    },
  },
});

// const defaultOptions = {
//   watchQuery: {
//     fetchPolicy: "cache-and-network",
//     errorPolicy: "ignore",
//   },
//   query: {
//     fetchPolicy: "network-only",
//     errorPolicy: "all",
//   },
//   mutate: {
//     errorPolicy: "all",
//   },
// };

export const client = new ApolloClient({
  uri,
  cache,
  // defaultOptions,
  onError: ({ networkError, graphQLErrors }) => {
    console.log("graphQLErrors", graphQLErrors);
    console.log("networkError", networkError);
  },
});
