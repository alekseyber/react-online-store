import React from "react";
import PropTypes from "prop-types";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import DoneIcon from "@material-ui/icons/Done";
import { makeStyles } from "@material-ui/core/styles";
import { cartEditItem } from "../../../graphql/localVarsCart";

const useStyles = makeStyles((theme) => ({
  color: {
    margin: theme.spacing(0.3),
    color: "#fff",
    minHeight: "28px",
    minWidth: "28px",
  },
}));

const ColorSelector = ({ index, level1Cart, level2Cart, levels1, product }) => {
  const classes = useStyles();

  const captionText = levels1.length > 1 ? "Изменить цвет:" : "Цвет:";

  
  const handleSetColor = (level1) => {
    const selected = level1Cart === level1.alias;
    if (!selected) {
      cartEditItem(index, level1.alias, level2Cart, product);
    }
  };

  const ColorItem = ({ itemLevel1 }) => {
    const style = {
      backgroundColor: "#" + itemLevel1.colorItem.colorkey,
    };
    const onClick = () => handleSetColor(itemLevel1);
    const params = { style, onClick };

    return (
      <IconButton {...params} className={classes.color} size="small">
        {itemLevel1.alias === level1Cart && <DoneIcon />}
      </IconButton>
    );
  };

  ColorItem.propTypes = {
    itemLevel1: PropTypes.object.isRequired,
  };

  return (
    <>
      <Typography
        variant="caption"
        component="div"
        className="font-weight-black"
      >
        {captionText}
      </Typography>
      <div>
        {levels1.map((itemLevel1) => (
          <ColorItem key={itemLevel1.alias} itemLevel1={itemLevel1} />
        ))}
      </div>
    </>
  );
};

ColorSelector.propTypes = {
  index: PropTypes.number.isRequired,
  level1Cart: PropTypes.string.isRequired,
  level2Cart: PropTypes.string.isRequired,
  levels1: PropTypes.array.isRequired,
  product: PropTypes.object.isRequired,
};

export default ColorSelector;
