import React from 'react';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import DoneIcon from '@material-ui/icons/Done';
import { makeStyles } from '@material-ui/core/styles';
import { cartEditItem } from '../../../redux/actions/cart';


const useStyles = makeStyles((theme) => ({
    color: {
        margin: theme.spacing(0.3),
        color: "#fff",
        minHeight: "28px",
        minWidth: "28px"
    },

}));




const ColorSelector = ({ index, level1_cart, level2_cart, levels1, colors }) => {
    const classes = useStyles();


    const dispatch = useDispatch();

    const handleSetColor = color => {

        const selected = (level1_cart === color);
        if (!selected) {
            dispatch(cartEditItem(index, color, level2_cart));
        }

    };

    const ColorItem = ({ item }) => {

        const style = {
            backgroundColor: '#' + colors[item].colorkey,

        };
        const onClick = () => handleSetColor(item);
        const params = { style, onClick };

        return <IconButton {...params} className={classes.color} size="small" >
            {(item === level1_cart) && <DoneIcon />}
        </IconButton>
    }  


    return (
        <>
            <Typography variant="caption" component="div" className="font-weight-black">Изменить цвет:</Typography>
            <div>
                {levels1.map((itemcolor) => (
                    <ColorItem key={itemcolor} item={itemcolor} />
                ))
                }
            </div>
        </>
    )

}




ColorSelector.propTypes = {
    index: PropTypes.number.isRequired,
    level1_cart: PropTypes.string.isRequired,
    level2_cart: PropTypes.string.isRequired,
    levels1: PropTypes.array.isRequired,
    colors: PropTypes.object.isRequired,
};


export default ColorSelector;