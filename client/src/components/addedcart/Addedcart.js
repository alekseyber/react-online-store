import React from "react";
import PropTypes from "prop-types";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import CardMedia from "@material-ui/core/CardMedia";
import { makeStyles } from "@material-ui/core/styles";
import { Image } from "../image/Image";

const useStyles = makeStyles((theme) => ({
  root: {
    [theme.breakpoints.up("sm")]: {
      minWidth: "350px",
    },
  },
  oldrice: {
    fontWeight: 700,
    marginLeft: theme.spacing(1),
    textDecoration: "line-through",
  },
}));

const AddedCart = ({ lastCart, currSymbol }) => {
  const classes = useStyles();

  return (
    <Grid container spacing={1} className={classes.root}>
      <Grid item xs={4}>
        <CardMedia>
          <Image
            src={lastCart.imgThumb}
            title={lastCart.title}
            alt={lastCart.title}
          />
        </CardMedia>
      </Grid>
      <Grid item xs={8}>
        {lastCart.gender && lastCart.gender.length > 0 && (
          <Typography variant="subtitle2" color="textSecondary" component="div">
            {lastCart.gender}
          </Typography>
        )}
        {lastCart.title && lastCart.title.length > 0 && (
          <Typography
            variant="subtitle1"
            component="div"
            className="mt-1 font-weight-black"
          >
            {lastCart.title}
          </Typography>
        )}
        {lastCart.level1 && (
          <div>
            <Typography
              variant="subtitle1"
              component="span"
              color="textSecondary"
            >
              Цвет:
            </Typography>
            <Typography
              variant="subtitle1"
              component="span"
              className="ml-1 text-uppercase font-weight-black"
            >
              {lastCart.level1}
            </Typography>
          </div>
        )}
        {lastCart.level2 && (
          <div>
            <Typography
              variant="subtitle1"
              component="span"
              color="textSecondary"
            >
              Размер:
            </Typography>
            <Typography
              variant="subtitle1"
              component="span"
              className="ml-1 text-uppercase font-weight-black"
            >
              {lastCart.level2}
            </Typography>
          </div>
        )}
        <div>
          <Typography
            variant="subtitle1"
            component="span"
            color="textSecondary"
            className="mr-1"
          >
            Цена:
          </Typography>
          <Typography
            variant="subtitle1"
            color="secondary"
            component="span"
            className="font-weight-black"
          >
            {lastCart.price} {currSymbol}
          </Typography>
          {lastCart.old_price > 0 && (
            <Typography
              variant="subtitle2"
              color="textSecondary"
              component="span"
              className={classes.oldrice}
            >
              {lastCart.old_price} {currSymbol}
            </Typography>
          )}
        </div>
      </Grid>
    </Grid>
  );
};

AddedCart.propTypes = {
  lastCart: PropTypes.object.isRequired,
  currSymbol: PropTypes.string,
};

export default AddedCart;
