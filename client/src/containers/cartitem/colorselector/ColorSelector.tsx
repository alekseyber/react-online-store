import { FC, CSSProperties } from "react";
//import PropTypes from "prop-types";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import DoneIcon from "@material-ui/icons/Done";
import { makeStyles } from "@material-ui/core/styles";
import { cartEditItem } from "../../../graphql/localVarsCart";
import { ProductFragment, TProductLevel1 } from "../../../graphql/gqlQuery";

const useStyles = makeStyles((theme) => ({
  color: {
    margin: theme.spacing(0.3),
    color: "#fff",
    minHeight: "28px",
    minWidth: "28px",
  },
}));

interface ColorSelectorProps {
  index: number;
  level1Cart: string;
  level2Cart: string;
  levels1: TProductLevel1[];
  product: ProductFragment;
}

interface ColorItemProps {
  itemLevel1: TProductLevel1;
}

const ColorSelector: FC<ColorSelectorProps> = ({
  index,
  level1Cart,
  level2Cart,
  levels1,
  product,
}) => {
  const classes = useStyles();

  const captionText = levels1.length > 1 ? "Изменить цвет:" : "Цвет:";

  const handleSetColor = (level1: TProductLevel1) => {
    const selected = level1Cart === level1.alias;
    if (!selected) {
      cartEditItem(index, level1.alias, level2Cart, product);
    }
  };

  const ColorItem: FC<ColorItemProps> = ({ itemLevel1 }) => {
    const style: CSSProperties = {
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

// ColorSelector.propTypes = {
//   index: PropTypes.number.isRequired,
//   level1Cart: PropTypes.string.isRequired,
//   level2Cart: PropTypes.string.isRequired,
//   levels1: PropTypes.array.isRequired,
//   product: PropTypes.object.isRequired,
// };

export default ColorSelector;
