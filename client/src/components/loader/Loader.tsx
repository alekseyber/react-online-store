import { FC } from "react";
import { makeStyles } from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";

const useStyles = makeStyles({
  wrap: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 9999,
    "&>div": {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "100vh",
      background: "rgba(0, 0, 0, .05)",
    },
  },
});

const Loader: FC = () => {
  const classes = useStyles();
  return (
    <div className={classes.wrap}>
      <div>
        <CircularProgress />
      </div>
    </div>
  );
};

export default Loader;
