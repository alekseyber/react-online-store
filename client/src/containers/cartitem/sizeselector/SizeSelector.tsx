import { FC } from "react";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import { cartEditItem } from "../../../graphql/localVarsCart";
import { TProductLevel2 } from "../../../graphql/gqlQuery";

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

interface ColorSelectorProps {
  index: number;
  level2Cart: string;
  levels2: TProductLevel2[];
}

interface SizeItemProps {
  item: TProductLevel2;
}

const SizeSelector: FC<ColorSelectorProps> = ({
  index,
  level2Cart,
  levels2,
}) => {
  const classes = useStyles();

  const handleSetSize = (level2: TProductLevel2): void => {
    const selected = level2Cart === level2.alias;
    if (!selected) {
      cartEditItem(index, null, level2.alias);
    }
  };
  const captionText = levels2.length > 1 ? "Изменить размер:" : "Размер:";

  const SizeItem: FC<SizeItemProps> = ({ item }) => {
    const variant: "text" | "outlined" | "contained" =
      level2Cart === item.alias ? "contained" : "outlined";

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

// SizeSelector.propTypes = {
//   index: PropTypes.number.isRequired,
//   level2Cart: PropTypes.string.isRequired,
//   levels2: PropTypes.array.isRequired,
// };

export default SizeSelector;
