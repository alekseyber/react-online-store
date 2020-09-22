import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import { hideAlert } from '../../redux/actions/app';

// import Alert from '@material-ui/lab/Alert';
// import IconButton from '@material-ui/core/IconButton';
// import Collapse from '@material-ui/core/Collapse';
// import CloseIcon from '@material-ui/icons/Close';


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
    //   if (!alertVisible) return null

    return (


        <Snackbar open={alertVisible} autoHideDuration={6000} onClose={closeAlertHandler}>
            <Alert onClose={closeAlertHandler} severity={alertType || 'success'}>
                {alertText}
            </Alert>
        </Snackbar>

        // <>
        //     <Collapse in={alertVisible}>
        //         <Alert
        //             action={
        //                 <IconButton
        //                     aria-label="close"
        //                     color="inherit"
        //                     size="small"
        //                     onClick={closeAlertHandler}
        //                 >
        //                     <CloseIcon fontSize="inherit" />
        //                 </IconButton>
        //             }
        //             severity={alertType || 'success'}
        //         >
        //             {alertText}
        //         </Alert>
        //     </Collapse>
        // </>
    )
}