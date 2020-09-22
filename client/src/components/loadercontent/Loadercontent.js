import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';


const useStyles = makeStyles({
  loader: {
    display: "flex",
    justifyContent: "center",
    //  alignItems: "center"
  },
});




const LoaderContent = ({ text }) => {
  const classes = useStyles();

  return (

    <>
      {text && <Typography variant="h6" component="h2" align="center" gutterBottom>{text}</Typography>}
      <div className={classes.loader}><CircularProgress size={30} thickness={5} /></div>
    </>

  );
}
LoaderContent.defaultProps = {
  text: 'Загрузка...',
};


LoaderContent.propTypes = {
  text: PropTypes.string,
};


export default LoaderContent;