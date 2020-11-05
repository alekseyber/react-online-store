import React from "react";
//import PropTypes from "prop-types";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: `${theme.spacing(1)}px ${theme.spacing(2)}px`,
    margin: 0,
    maxWidth: "100%",
  },
}));

interface ModalTitleProps {
  handleClose: () => void;
}

const ModalTitle: React.FC<ModalTitleProps> = ({ handleClose, children }) => {
  const classes = useStyles();
  return (
    <Grid
      container
      className={classes.root}
      spacing={2}
      justify="space-between"
      direction="row"
      alignItems="center"
    >
      <Typography variant="h6" component="div">
        {children}
      </Typography>
      {handleClose && (
        <IconButton onClick={handleClose}>
          <CloseIcon />
        </IconButton>
      )}
    </Grid>
  );
};

// ModalTitle.propTypes = {
//   handleClose: PropTypes.func,
//   children: PropTypes.string.isRequired,
// };

export default ModalTitle;
