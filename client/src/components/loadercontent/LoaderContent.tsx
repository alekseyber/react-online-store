import React from "react";
//import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";
import Typography from "@material-ui/core/Typography";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";

const useStyles = makeStyles({
  loader: {
    display: "flex",
    justifyContent: "center",
    //  alignItems: "center"
  },
  root: {
    minHeight: "20vh",
  },
});

interface LoaderContentProps {
  text?: string;
}

const LoaderContent: React.FC<LoaderContentProps> = ({
  text = "Загрузка...",
}) => {
  const classes = useStyles();

  return (
    <Card className={classes.root}>
      <CardContent>
        {text && (
          <Typography variant="h6" component="h2" align="center" gutterBottom>
            {text}
          </Typography>
        )}
        <div className={classes.loader}>
          <CircularProgress size={30} thickness={5} />
        </div>
      </CardContent>
    </Card>
  );
};
// LoaderContent.defaultProps = {
//   text: "Загрузка...",
// };

// LoaderContent.propTypes = {
//   text: PropTypes.string,
// };

export default LoaderContent;
