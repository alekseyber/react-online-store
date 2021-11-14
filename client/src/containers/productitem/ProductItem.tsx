import { useMemo, FC } from "react";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import ProductForCatalog from "../../components/productforcatalog/ProductForCatalog";
import { useProductDataRender } from "../../hooks/useProductDataRender.hook";
import {
  PRODUCT_ITEM_QUERY,
  TProductImgProperty,
  IProduct,
  IProductVar,
  TStateSelectColor,
} from "../../graphql/gqlQuery";
import { useQueryApp } from "../../hooks/appolloQueryApp.hook";

export interface IPropsColorSelect {
  colorselect?: string | null | undefined;
}

interface ItemProps extends IPropsColorSelect {
  alias: string;
}

interface IBaseData {
  baseurl: string;
  stateSelectColor: TStateSelectColor;
}

interface ProductItemProps {
  imgproperty: TProductImgProperty[];
  quality: number;
  currsymbol: string;
  related?: boolean;
  item: string | ItemProps;
}

const ProductItem: FC<ProductItemProps> = ({
  item,
  imgproperty,
  quality,
  currsymbol,
  related = false,
}) => {
  // const alias = item.alias ? item.alias : item;
  // const colorselect = item.colorselect ? item.colorselect : null;

  const { alias, colorselect } = useMemo<ItemProps>(() => {
    const rezult: ItemProps = {
      alias: "",
      colorselect: null,
    };

    if (typeof item === "string") {
      rezult.alias = item;
      return rezult;
    }

    rezult.alias = (item as ItemProps).alias;

    if ((item as ItemProps).colorselect) {
      rezult.colorselect = (item as ItemProps).colorselect;
    }
    return rezult;
  }, [item]);

  const { data } = useQueryApp<IProduct, IProductVar>(PRODUCT_ITEM_QUERY, {
    alias,
  });

  const { baseurl, stateSelectColor } = useMemo<IBaseData>(() => {
    const rezult: IBaseData = {
      baseurl: "",
      stateSelectColor: null,
    };

    if (data) {
      rezult.baseurl = data.baseApiUrl;
      rezult.stateSelectColor = data.stateSelectColor;
    }
    return rezult;
  }, [data]);

  const productDataRender = useProductDataRender({
    colorselect,
    imgproperty,
    baseurl,
    productData: data,
    stateSelectColor,
    qualityproductImg: quality,
  });

  if (!productDataRender) {
    return null;
  }

  if (related)
    return (
      <>
        <Typography gutterBottom variant="h6" component="h2">
          Вам также может понравиться
        </Typography>
        <ProductForCatalog
          product={productDataRender}
          currsymbol={currsymbol}
        />
      </>
    );

  return (
    <Grid item xs={12} sm={6} md={3}>
      <ProductForCatalog product={productDataRender} currsymbol={currsymbol} />
    </Grid>
  );
};

// ProductItem.defaultProps = {
//   currsymbol: "",
//   related: false,
// };

// ProductItem.propTypes = {
//   item: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
//   imgproperty: PropTypes.array.isRequired,
//   quality: PropTypes.number.isRequired,
//   related: PropTypes.bool,
//   currsymbol: PropTypes.string,
// };

export default ProductItem;
