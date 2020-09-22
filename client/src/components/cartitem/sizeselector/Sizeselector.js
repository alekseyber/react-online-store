import React from 'react';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { cartEditItem } from '../../../redux/actions/cart';


const useStyles = makeStyles((theme) => ({
    btns: {
        '& > *': {
            margin: theme.spacing(0.5),
        },
        '& .MuiButton-root': {
            minWidth: "40px",
        }

    },

}));




const SizeSelector = ({ index, level2_cart, levels2, sizes }) => {
    const classes = useStyles();



    const dispatch = useDispatch();

    const handleSetSize = size => {


        const selected = (level2_cart === size);
        if (!selected) {
            dispatch(cartEditItem(index, null, size));
        }

    };




    const SizeItem = ({ item }) => {

        const variant = (level2_cart === item) ? 'contained' : 'outlined';

        return <Button
            variant={variant}
            color='primary'
            onClick={() => handleSetSize(item)}
            size="small"
        >{sizes[item].title}</Button>
    }


    return (
        <>
            <Typography variant="caption" component="div" className="font-weight-black">Изменить размер:</Typography>
            <div className={classes.btns}>
                {levels2.map((itemsize) => (
                    <SizeItem key={itemsize} item={itemsize} />
                ))
                }
            </div>
        </>
    )

}




SizeSelector.propTypes = {
    index: PropTypes.number.isRequired,
    level2_cart: PropTypes.string.isRequired,
    levels2: PropTypes.array.isRequired,
    sizes: PropTypes.object.isRequired,
};


export default SizeSelector;