import { useMemo, useEffect, FC } from "react";
import makeStyles from '@mui/styles/makeStyles';
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import ProductItem from "../productitem/ProductItem";
import { addRecentlyViewed, TRecentlyViewed } from "../../graphql/localVarsApp";
import {
  RECENTLY_VIEWED_QUERY,
  IRecentlyViewed,
  TProductImgProperty,
} from "../../graphql/gqlQuery";
import { useQueryApp } from "../../hooks/appolloQueryApp.hook";

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: theme.spacing(5),
    marginBottom: theme.spacing(5),
  },
}));

interface RecentlyViewedProps {
  alias: string;
  imgproperty: TProductImgProperty[];
  quality: number;
  currsymbol: string;
}

const RecentlyViewed: FC<RecentlyViewedProps> = ({
  alias,
  imgproperty,
  quality,
  currsymbol,
}) => {
  const classes = useStyles();

  const { data } = useQueryApp<IRecentlyViewed>(RECENTLY_VIEWED_QUERY);

  const recentlyViewed = useMemo(() => {
    if (!data) {
      return [];
    }
    return data.recentlyViewed;
  }, [data]);

  useEffect(() => {
    addRecentlyViewed(alias);
  }, [alias]);

  const products = useMemo(() => {
    const rezult: TRecentlyViewed = [];
    if (recentlyViewed.length) {
      let q = 0;

      for (let i = 0; i < recentlyViewed.length; i++) {
        if (recentlyViewed[i] !== alias) {
          rezult.push(recentlyViewed[i]);
          q++;
        }

        if (q === 4) {
          break;
        }
      }
    }

    return rezult;
  }, [recentlyViewed, alias]);

  if (products.length === 0) {
    return null;
  }

  return (
    <div className={classes.root}>
      <Typography gutterBottom variant="h6" component="h2">
        Недавно просмотренные
      </Typography>
      <Grid container spacing={2}>
        {products.map((item, index) => (
          <ProductItem
            item={item}
            imgproperty={imgproperty}
            quality={quality}
            currsymbol={currsymbol}
            key={index}
          />
        ))}
      </Grid>
    </div>
  );
};

// RecentlyViewed.defaultProps = {
//   currsymbol: "",
// };

// RecentlyViewed.propTypes = {
//   alias: PropTypes.string.isRequired,
//   imgproperty: PropTypes.array.isRequired,
//   quality: PropTypes.number.isRequired,
//   currsymbol: PropTypes.string,
// };

export default RecentlyViewed;
