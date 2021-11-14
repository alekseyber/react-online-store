import { FC } from "react";
import { styled } from "@mui/material/styles";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Skeleton from "@mui/material/Skeleton";

const CssRootCard = styled(Card)(({ theme }) => ({
  "& .productCatalog-header": {
    position: "relative",
    "& > div": {
      position: "absolute",
      zIndex: 10,
      top: theme.spacing(1),
    },
  },

  "& .productCatalog-colorwrap": {
    width: "52%",
    right: theme.spacing(1),
    display: "flex",
    justifyContent: "flex-end",
    flexWrap: "wrap",
    zIndex: 10,
  },
}));

interface ProductCatalogSceletonProps {
  news?: boolean;
}

function randomInteger(min = 3, max = 6) {
  let rand = min - 0.5 + Math.random() * (max - min + 1);
  return Math.round(rand);
}

const ProductCatalogSceleton: FC<ProductCatalogSceletonProps> = ({
  news = false,
}) => {
  return (
    <CssRootCard>
      {news ? (
        <CardContent>
          <Typography variant="subtitle1" component="div">
            <Skeleton width={180} />
          </Typography>
          {Array(6)
            .fill(1)
            .map((_, index) => (
              <Skeleton key={index} />
            ))}
        </CardContent>
      ) : (
        <div className="productCatalog-header">
          <div className="productCatalog-colorwrap">
            {Array(randomInteger())
              .fill(1)
              .map((_, index) => (
                <Skeleton
                  key={index}
                  variant="circular"
                  width={16}
                  height={16}
                  sx={{ bgcolor: "grey.400", margin: "3px" }}
                />
              ))}
          </div>
        </div>
      )}
      <Skeleton sx={{ height: 210 }} animation="wave" variant="rectangular" />
      {!news && (
        <CardContent>
          <Typography variant="subtitle2" color="textSecondary" component="div">
            <Skeleton width={150} />
          </Typography>
          <Typography variant="subtitle1" component="div">
            <Skeleton />
          </Typography>
          <Typography variant="subtitle1" component="div">
            <Skeleton
              width={100}
              sx={(theme) => ({ bgcolor: theme.palette.priceprimary.main })}
            />
          </Typography>
        </CardContent>
      )}
    </CssRootCard>
  );
};

export default ProductCatalogSceleton;
