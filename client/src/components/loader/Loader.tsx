import React from "react";
import classes from "./Loader.module.scss";
import CircularProgress from "@material-ui/core/CircularProgress";

const Loader: React.FC = () => {
  return (
    <div className={classes.loaderWrap}>
      <div>
        <CircularProgress />
      </div>
    </div>
  );
};

export default Loader;
