import React from "react";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";

const ColorCircularProgress = withStyles({
  root: {
    color: "#00695c",
  },
})(CircularProgress);

const useStyles = makeStyles(() => ({
  root: {
    flexGrow: 1,
    height: "60vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
}));

const LoaderPage = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <ColorCircularProgress size={30} thickness={5} />
    </div>
  );
};

export default LoaderPage;
