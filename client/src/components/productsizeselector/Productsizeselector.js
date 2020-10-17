import React from "react";
import { useDispatch, useSelector } from "react-redux";
import PropTypes from "prop-types";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import { setSizeProduct } from "../../redux/actions/productselect";
import { openSizeChart } from "../../redux/actions/modaldialog";

const useStyles = makeStyles((theme) => ({
  btns: {
    "& > *": {
      margin: theme.spacing(0.5),
    },
  },
}));

const ProductSizeSelector = ({
  level2,
  alias,
  error,
  set_error,
  sizesgroup_id,
}) => {
  const classes = useStyles();

  const selectSize = useSelector((state) => state.productselect.size[alias]);

  const dispatch = useDispatch();

  const handleSetSize = (size) => {
    const selected = selectSize === size;
    if (!selected) {
      dispatch(setSizeProduct({ alias, size }));
      if (set_error && error) {
        set_error(false);
      }
    }
  };

  const handleSizeChart = () => {
    dispatch(openSizeChart(sizesgroup_id));
  };

  const labelText = error ? "Пожалуйста, выберите размер:" : "Выберите размер:";
  const labelColorText = error ? "error" : "textSecondary";

  const SizeItem = ({ item }) => {
    const variant = selectSize === item.alias ? "contained" : "outlined";

    return (
      <Button
        variant={variant}
        color="primary"
        onClick={() => handleSetSize(item.alias)}
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
      <Typography variant="subtitle1" component="div" color={labelColorText}>
        {labelText}
      </Typography>
      {error && (
        <Typography variant="caption" color="error">
          *Размер можно скорректировать при подтверждении заказа менеджером
        </Typography>
      )}
      <div className={classes.btns}>
        {level2.map((itemsize, index) => (
          <SizeItem key={index} item={itemsize} />
        ))}
      </div>
      {sizesgroup_id && (
        <Button onClick={handleSizeChart} size="small" className="mt-1">
          Размерная сетка
        </Button>
      )}
    </>
  );
};

ProductSizeSelector.defaultProps = {
  error: false,
};

ProductSizeSelector.propTypes = {
  level2: PropTypes.array.isRequired,
  alias: PropTypes.string.isRequired,
  error: PropTypes.bool,
  sizesgroup_id: PropTypes.string,
  set_error: PropTypes.func,
};

export default ProductSizeSelector;
