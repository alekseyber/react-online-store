import { FC } from "react";
import Grid from "@mui/material/Grid";
import { Breakpoint, Theme, useTheme, styled } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import ProductCatalogSceleton from "./ProductCatalogSceleton";

const CssRootGrid = styled(Grid)(({ theme }) => ({
  marginTop: theme.spacing(2),
  marginBottom: theme.spacing(2),
}));

export interface IProductListSceletonProps {
  news?: boolean;
  container?: boolean;
}

type IlengthForKeys = {
  [propName in Breakpoint]: number;
};

function useLength() {
  const theme: Theme = useTheme();
  const keys: readonly Breakpoint[] = ["sm", "lg"]; //"md", md: 4, , "xs" "sm",
  const lengthForKeys: IlengthForKeys = {
    xs: 2,
    sm: 4,
    md: 4,
    lg: 8,
    xl: 8,
  };

  return (
    keys.reduce((output: number, key: Breakpoint) => {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const matches = useMediaQuery(theme.breakpoints.up(key));
      return matches ? lengthForKeys[key] : output;
    }, 2) || 2
  );
}

const ProductListSceleton: FC<IProductListSceletonProps> = ({
  news = false,
  container = true,
}) => {
  const productLength = useLength();
  const productList = new Array(productLength).fill(1);
  const md = news ? 6 : 3;

  if (!container) {
    return (
      <>
        {productList.map((_, index) => (
          <Grid item xs={12} sm={6} md={md} key={index}>
            <ProductCatalogSceleton news={news} />
          </Grid>
        ))}
      </>
    );
  }

  return (
    <CssRootGrid container spacing={2}>
      {productList.map((_, index) => (
        <Grid item xs={12} sm={6} md={md} key={index}>
          <ProductCatalogSceleton news={news} />
        </Grid>
      ))}
    </CssRootGrid>
  );
};

export default ProductListSceleton;
