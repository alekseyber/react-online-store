import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useDispatch } from 'react-redux';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import CloseIcon from '@material-ui/icons/Close';
import { useInput } from '../../hooks/input.hook';
import { cartAddCupon } from '../../redux/actions/cart';
import ButtonProgress from "../buttonprogress/ButtonProgress";




const useStyles = makeStyles((theme) => ({
    // root: {
    //   width: '100%',
    // },
    heading: {
        fontSize: theme.typography.pxToRem(15),
        fontWeight: theme.typography.fontWeightRegular,
    },
    body: {
        alignItems: "center"
    }
}));


const CartAddCupon = () => {
    const classes = useStyles();
    const dispatch = useDispatch();

    const inputCupon = useInput('');

    const handleSetCupon = () => {
        dispatch(cartAddCupon(inputCupon.value));
    };

    return (

        <Accordion>
            <AccordionSummary>
                <Typography className={classes.heading}>У меня есть промокод</Typography>
            </AccordionSummary>
            <AccordionDetails className={classes.body}>
                <TextField
                    label="Введите промокод"
                    {...inputCupon.bind}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton onClick={inputCupon.clear} disabled={(inputCupon.value.length === 0)}>
                                    <CloseIcon fontSize="small" />
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                />
                <ButtonProgress variant="contained" color="primary" size="small" className="ml-2" onClick={handleSetCupon} disabled={!(inputCupon.value.length > 5 && inputCupon.value.length < 12)} >Применить</ButtonProgress>
            </AccordionDetails >
        </Accordion >


    )
}

export default CartAddCupon;