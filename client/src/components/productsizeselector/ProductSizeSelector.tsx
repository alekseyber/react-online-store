import { FC, Dispatch, SetStateAction } from "react";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/material/styles";
import { setSizeProduct } from "../../graphql/localVarsCart";
import { openSizeChart } from "../../graphql/localVarsModal";
import {
  SELECT_SIZE_QUERY,
  TProductLevel2,
  ISelectSize,
  ISelectSizeVar,
} from "../../graphql/gqlQuery";
import { useQueryApp } from "../../hooks/appolloQueryApp.hook";

const CssRootDiv = styled("div")(({ theme }) => ({
  "& .MuiButton-root": {
    margin: theme.spacing(0.5),
  },
}));

// const useStyles = makeStyles((theme) => ({
//   btns: {
//     "& > *": {
//       margin: theme.spacing(0.5),
//     },
//   },
// }));

interface ProductSizeSelectorProps {
  level2: TProductLevel2[];
  alias: string;
  error: boolean;
  sizesgroup_id: string;
  set_error?: Dispatch<SetStateAction<boolean>>;
}

interface SizeItemProps {
  item: TProductLevel2;
}

const ProductSizeSelector: FC<ProductSizeSelectorProps> = ({
  level2,
  alias,
  error,
  set_error,
  sizesgroup_id,
}) => {
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

  const SizeItem: FC<SizeItemProps> = ({ item }) => {
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
      <CssRootDiv>
        {level2.map((itemsize) => (
          <SizeItem key={itemsize.alias} item={itemsize} />
        ))}
      </CssRootDiv>
      {sizesgroup_id && (
        <Button onClick={handleSizeChart} size="small" className="mt-1">
          Размерная сетка
        </Button>
      )}
    </>
  );
};

export default ProductSizeSelector;
