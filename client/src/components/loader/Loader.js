import React from 'react';
import classes from './Loader.module.scss';
import CircularProgress from '@material-ui/core/CircularProgress';




export default () => {


  return (
    <div className={classes.loaderWrap}>
      <div>
        <CircularProgress />
      </div>
    </div>
  )
}







