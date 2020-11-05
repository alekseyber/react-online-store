import React from "react";
//import PropTypes from "prop-types";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import { setSizeProduct } from "../../graphql/localVarsCart";
import { openSizeChart } from "../../graphql/localVarsModal";
import {
  SELECT_SIZE_QUERY,
  TProductLevel2,
  ISelectSize,
  ISelectSizeVar,
} from "../../graphql/gqlQuery";
import { useQueryApp } from "../../hooks/appolloQueryApp.hook";

const useStyles = makeStyles((theme) => ({
  btns: {
    "& > *": {
      margin: theme.spacing(0.5),
    },
  },
}));

interface ProductSizeSelectorProps {
  level2: TProductLevel2[];
  alias: string;
  error: boolean;
  sizesgroup_id: string;
  set_error?: React.Dispatch<React.SetStateAction<boolean>>;
}

interface SizeItemProps {
  item: TProductLevel2;
}

const ProductSizeSelector: React.FC<ProductSizeSelectorProps> = ({
  level2,
  alias,
  error,
  set_error,
  sizesgroup_id,
}) => {
  const classes = useStyles();

  const { data } = useQueryApp<ISelectSize, ISelectSizeVar>(SELECT_SIZE_QUERY, {
    alias,
  });

  const selectSize = data ? data.selectSize : null;

  const handleSetSize = (size: string) => {
    const selected = selectSize === size;
    if (!selected) {
      setSizeProduct(alias, size);
      if (set_error && error) {
        set_error(false);
      }
    }
  };

  const handleSizeChart = () => {
    openSizeChart(sizesgroup_id);
  };

  const labelText = error ? "Пожалуйста, выберите размер:" : "Выберите размер:";
  const labelColorText = error ? "error" : "textSecondary";

  const SizeItem: React.FC<SizeItemProps> = ({ item }) => {
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
  // SizeItem.propTypes = {
  //   item: PropTypes.object.isRequired,
  // };

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

// ProductSizeSelector.defaultProps = {
//   error: false,
// };

// ProductSizeSelector.propTypes = {
//   level2: PropTypes.array.isRequired,
//   alias: PropTypes.string.isRequired,
//   error: PropTypes.bool,
//   sizesgroup_id: PropTypes.string,
//   set_error: PropTypes.func,
// };

export default ProductSizeSelector;
