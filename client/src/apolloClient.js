import { ApolloClient, InMemoryCache } from "@apollo/client";

const baseApiUrl = () => {
  if (process.env.REACT_APP_API_URL) {
    return process.env.REACT_APP_API_URL;
  }
  return process.env.NODE_ENV !== "production" ? "http://localhost:5000" : "";
};

const BASE_API_URL = baseApiUrl();

const uri = `${BASE_API_URL}/api/graphql`;

const cache = new InMemoryCache({
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
    Category: [
      "CategoryContData",
      "CategoryProductsData",
      "ProductsCategory",
      "Product",
    ],
    ProductsCategory: ["CategoryProduct"],
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
  },
  typePolicies: {
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
    ProductsCategory: {
      keyFields: ["alias", "sortValue"],
    },
    Order: {
      keyFields: ["id"],
    },
    SearchFull: {
      keyFields: [],
    },
    Query: {
      fields: {
        product(_, { args, toReference }) {
          return toReference({
            __typename: "Product",
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
            __typename: "ProductsCategory",
            alias: args.alias,
            sortValue: args.sortValue,
          });
        },
      },
    },
    Category: {
      keyFields: ["alias"],
      fields: {
        productsCategory(_, { args, toReference }) {
          return toReference({
            __typename: "ProductsCategory",
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
