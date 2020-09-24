import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import { hideAlert } from '../../redux/actions/app';



const Alert = props => {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}


export default () => {

    const { alertType, alertText, alertVisible } = useSelector(state => state.app);
    const dispatch = useDispatch();

    const closeAlertHandler = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        dispatch(hideAlert())
    };
   
    return (

        <Snackbar open={alertVisible} autoHideDuration={6000} onClose={closeAlertHandler}>
            <Alert onClose={closeAlertHandler} severity={alertType || 'success'}>
                {alertText}
            </Alert>
        </Snackbar>
    )
}