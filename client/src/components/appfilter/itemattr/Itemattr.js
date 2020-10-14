import React from 'react';
import PropTypes from 'prop-types';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import Brightness1Icon from '@material-ui/icons/Brightness1';
import { useDispatch } from 'react-redux';
import { setFilterSelect } from '../../../redux/actions/filter';


const ItemAttr = ({ itemAttr, aliasGr, color, sizes, itemSelect, oneStatus }) => {

    const dispatch = useDispatch();
    

    const handleChange = () => {
        dispatch(setFilterSelect(aliasGr, itemAttr.alias));
    };
    //  const checked = false;

    const checked = itemSelect[itemAttr.alias] ? true : false;
    const disabledStatus = !checked && oneStatus;
    //  const disabledStatus = false;

    let icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
    let checkedIcon = <CheckBoxIcon fontSize="small" />;
    let checkColorValue = "primary";

    let title;

    if (color) {
        
        title = itemAttr.colorGruppItem.title;
        //title = colorsData[itemAttr.alias].title;
        const style = { color: itemAttr.colorGruppItem.colorkey };
      //  const style = { color: colorsData[itemAttr.alias].colorkey };
        icon = <Brightness1Icon fontSize="small" style={style} />;
        checkedIcon = <CheckCircleIcon fontSize="small" style={style} />;
    } else if (sizes) {        
        //title = sizesData[itemAttr.alias].title;
        title = itemAttr.sizeItem.title;

    } else {
        title = itemAttr.title;

    }



    return (
        <FormControlLabel
            control={
                <Checkbox
                    checked={checked}
                    onChange={handleChange}
                    icon={icon}
                    checkedIcon={checkedIcon}
                    color={checkColorValue}
                    disabled={disabledStatus}
                />
            }
            label={title}
        />
    )
}


ItemAttr.propTypes = {
    itemAttr: PropTypes.object.isRequired,
   // colorsData: PropTypes.object.isRequired,
   // sizesData: PropTypes.object.isRequired,
    aliasGr: PropTypes.string.isRequired,
    color: PropTypes.bool.isRequired,
    sizes: PropTypes.bool.isRequired,
    itemSelect: PropTypes.object.isRequired,
    oneStatus: PropTypes.bool.isRequired,
};

export default ItemAttr;
