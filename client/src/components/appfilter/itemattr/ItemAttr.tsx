import { FC } from "react";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import CheckBoxOutlineBlankIcon from "@material-ui/icons/CheckBoxOutlineBlank";
import CheckBoxIcon from "@material-ui/icons/CheckBox";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import Brightness1Icon from "@material-ui/icons/Brightness1";
import {
  setFilterSelect,
  IFilterSelectAttr,
} from "../../../graphql/localVarsFilter";
import {
  TFAttrsItem,
  FAttrs,
  FColorAttrs,
  FSizesAttrs,
} from "../../../graphql/gqlQuery";

interface ItemAttrProps {
  itemAttr: TFAttrsItem;
  aliasGr: string;
  color: boolean;
  sizes: boolean;
  itemSelect: IFilterSelectAttr;
  oneStatus: boolean;
  handleClose?: () => void;
}

const ItemAttr: FC<ItemAttrProps> = ({
  itemAttr,
  aliasGr,
  color,
  sizes,
  itemSelect,
  oneStatus,
  handleClose,
}) => {
  const handleChange = () => {
    setFilterSelect(aliasGr, itemAttr.alias);
    if (handleClose) handleClose();
  };
  //  const checked = false;

  const checked = itemSelect[itemAttr.alias] ? true : false;
  const disabledStatus = !checked && oneStatus;
  //  const disabledStatus = false;

  let icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
  let checkedIcon = <CheckBoxIcon fontSize="small" />;
  const checkColorValue: "primary" | "secondary" | "default" = "primary";

  let title: string = "";

  if (color) {
    title = (itemAttr as FColorAttrs).colorGruppItem.title;
    const style: React.CSSProperties = {
      color: (itemAttr as FColorAttrs).colorGruppItem.colorkey,
    };
    icon = <Brightness1Icon fontSize="small" style={style} />;
    checkedIcon = <CheckCircleIcon fontSize="small" style={style} />;
  } else if (sizes) {
    title = (itemAttr as FSizesAttrs).sizeItem.title;
  } else {
    title = (itemAttr as FAttrs).title;
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
  );
};

export default ItemAttr;
