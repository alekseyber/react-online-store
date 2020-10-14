import React from "react";
import { useDispatch } from "react-redux";
import PropTypes from "prop-types";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import { cartEditItem } from "../../../redux/actions/cart";

const useStyles = makeStyles((theme) => ({
  btns: {
    "& > *": {
      margin: theme.spacing(0.5),
    },
    "& .MuiButton-root": {
      minWidth: "40px",
    },
  },
}));

const SizeSelector = ({ index, level2Cart, levels2 }) => {
  const classes = useStyles();

  const dispatch = useDispatch();

  const handleSetSize = (level2) => {
    const selected = level2Cart === level2.alias;
    if (!selected) {
      dispatch(cartEditItem(index, null, level2.alias));
    }
  };
  const captionText = levels2.length > 1 ? "Изменить размер:" : "Размер:";

  const SizeItem = ({ item }) => {
    const variant = level2Cart === item.alias ? "contained" : "outlined";

    return (
      <Button
        variant={variant}
        color="primary"
        onClick={() => handleSetSize(item)}
        size="small"
      >
        {item.sizeItem.title}
      </Button>
    );
  };

  SizeItem.propTypes = {
    item: PropTypes.object.isRequired,
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
      <div className={classes.btns}>
        {levels2.map((itemsize) => (
          <SizeItem key={itemsize.alias} item={itemsize} />
        ))}
      </div>
    </>
  );
};

SizeSelector.propTypes = {
  index: PropTypes.number.isRequired,
  level2Cart: PropTypes.string.isRequired,
  levels2: PropTypes.array.isRequired,
};

export default SizeSelector;
