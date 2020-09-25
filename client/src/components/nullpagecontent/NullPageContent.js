import React from "react";
import PropTypes from "prop-types";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
  root: {
    minHeight: "20vh",
  },
});

const NullPageContent = ({ title, str }) => {
  const classes = useStyles();
  return (
    <Card className={classes.root}>
      <CardContent>
        {title && (
          <Typography variant="h6" component="h2" align="center" gutterBottom>
            {title}
          </Typography>
        )}
        {str && (
          <Typography variant="body1" component="p" align="center">
            {str}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

NullPageContent.propTypes = {
  title: PropTypes.string,
  str: PropTypes.string,
};

export default NullPageContent;
