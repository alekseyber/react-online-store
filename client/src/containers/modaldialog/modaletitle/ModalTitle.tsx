import { FC } from "react";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import makeStyles from '@mui/styles/makeStyles';
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: `${theme.spacing(1)} ${theme.spacing(2)}`,
    margin: 0,
    maxWidth: "100%",
  },
}));

interface ModalTitleProps {
  handleClose: () => void;
}

const ModalTitle: FC<ModalTitleProps> = ({ handleClose, children }) => {
  const classes = useStyles();
  return (
    <Grid
      container
      className={classes.root}
      spacing={2}
      justifyContent="space-between"
      direction="row"
      alignItems="center"
    >
      <Typography variant="h6" component="div">
        {children}
      </Typography>
      {handleClose && (
        <IconButton onClick={handleClose} size="large">
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
