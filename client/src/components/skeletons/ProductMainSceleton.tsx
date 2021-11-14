import { FC } from "react";
import Skeleton from "@mui/material/Skeleton";
import { styled } from "@mui/material/styles";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Box from "@mui/material/Box";

type TVariant = "text" | "circular" | "rectangular" | undefined;

const CssRootCard = styled(Card)(({ theme }) => ({
  "& .productForMain-rowinf": {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  "& .productForMain-title": {
    padding: `${theme.spacing(1)} 0`,
  },

  "& .productForMain-paramName": {
    marginLeft: theme.spacing(1),
  },
}));

const ProductMainSceleton: FC = () => {
  return (
    <CssRootCard>
      <CardContent>
        <Grid
          container
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography
            variant="subtitle1"
            color="textSecondary"
            component="div"
            width="30%"
          >
            <Skeleton />
          </Typography>

          <Typography variant="subtitle1" component="div" width="20%">
            <Skeleton
              sx={(theme) => ({ bgcolor: theme.palette.priceprimary.main })}
            />
          </Typography>
        </Grid>
        <Divider />
        <Typography
          variant="h6"
          component="h1"
          className="productForMain-title"
          width="70%"
        >
          <Skeleton />
        </Typography>
        {[1, 2].map((_, i) => (
          <Grid
            container
            direction="row"
            className="productForMain-rowinf"
            key={i}
          >
            <Typography
              variant="subtitle1"
              component="span"
              color="textSecondary"
              width="30%"
            >
              <Skeleton />
            </Typography>
            <Typography
              variant="subtitle1"
              component="span"
              className="productForMain-paramName"
              width="40%"
            >
              <Skeleton />
            </Typography>
          </Grid>
        ))}
        {["circular", "rectangular"].map((variant, index) => (
          <div className="productForMain-rowinf" key={index}>
            <Typography
              variant="subtitle1"
              component="div"
              color="textSecondary"
              width="40%"
            >
              <Skeleton />
            </Typography>
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
              }}
            >
              {Array(index === 0 ? 7 : 6)
                .fill(1)
                .map((_, i) => (
                  <Skeleton
                    variant={variant as TVariant}
                    width={index === 0 ? 28 : 40}
                    height={28}
                    sx={{ bgcolor: "grey.400", m: 0.4 }}
                    key={i}
                  />
                ))}
            </Box>
          </div>
        ))}

        <Skeleton width="40%" />
        <Skeleton
          variant="rectangular"
          height={30}
          sx={{ bgcolor: "grey.400", mt: 2 }}
        />
        <Skeleton
          variant="rectangular"
          height={30}
          sx={{ bgcolor: "grey.400", mt: 1, mb: 1 }}
        />
        <Box mt={3}>
          <Divider />
          <Skeleton />
          <Skeleton />
          <Skeleton />
          <Skeleton />
        </Box>
      </CardContent>
    </CssRootCard>
  );
};

export default ProductMainSceleton;
