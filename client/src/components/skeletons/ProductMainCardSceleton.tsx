import { FC } from "react";
import Grid from "@mui/material/Grid";
import { Theme, styled } from "@mui/material/styles"; //styled,
import useMediaQuery from "@mui/material/useMediaQuery";
import ProductMainSceleton from "./ProductMainSceleton";
import ContentSceleton from "./ContentSceleton";
import Skeleton from "@mui/material/Skeleton";

const CssRootGrid = styled(Grid)(({ theme }) => ({
  marginTop: theme.spacing(2),
  marginBottom: theme.spacing(5),
}));

const ProductMainCardSceleton: FC = () => {
  const isMdWidth = useMediaQuery((theme: Theme) => theme.breakpoints.up("md"));
  const isLgWidth = useMediaQuery((theme: Theme) => theme.breakpoints.up("lg"));

  return (
    <CssRootGrid container spacing={2}>
      {isMdWidth && (
        <Grid item xs={12} md={8} lg={7}>
          <Skeleton variant="rectangular" width="100%" height="100%" />
        </Grid>
      )}
      <Grid item xs={12} md={4} lg={5}>
        <ProductMainSceleton />
      </Grid>
      {isLgWidth && (
        <Grid item xs={12}>
          <ContentSceleton />
        </Grid>
      )}
    </CssRootGrid>
  );
};

export default ProductMainCardSceleton;
