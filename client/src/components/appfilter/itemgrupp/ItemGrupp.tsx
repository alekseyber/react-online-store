import { FC, useState, SyntheticEvent } from "react";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import Button from "@mui/material/Button";
import clsx from "clsx";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import makeStyles from '@mui/styles/makeStyles';
import ItemAttr from "../itemattr/ItemAttr";
import { ItemGruppProps } from "../AppFilter";

const useStyles = makeStyles((theme) => ({
  btngr: {
    marginRight: theme.spacing(2),
  },
  menuitem: {
    paddingTop: "0",
    paddingBottom: "0",
  },
  expand: {
    transform: "rotate(0deg)",
    marginLeft: "auto",
    transition: theme.transitions.create("transform", {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: "rotate(180deg)",
  },
}));

const ItemGrupp: FC<ItemGruppProps> = ({ itemGr, filterSelect }) => {
  const classes = useStyles();

  const [anchorEl, setAnchorEl] = useState<(EventTarget & HTMLElement) | null>(
    null
  );
  const open = Boolean(anchorEl);

  const handleClose = () => {
    setAnchorEl(null);
  };

  //   const handleClickMenuItem = (aliasGr, itemAttr) => {
  //     setFilterSelect(aliasGr, itemAttr);
  //     handleClose();
  //   };

  const handleMenu = (event: SyntheticEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const icon = (
    <ExpandMoreIcon
      fontSize="small"
      className={clsx(classes.expand, {
        [classes.expandOpen]: anchorEl,
      })}
    />
  );

  const aliasGr = itemGr.alias;
  const color = itemGr.color;
  const sizes = itemGr.sizes;

  const itemSelect = filterSelect[aliasGr] ?? {};
  const countSelect = Object.keys(itemSelect).length;
  const selected = countSelect ? ` (${countSelect}) ` : "";

  const ITEM_HEIGHT = 128;

  const attrsCount = itemGr.attrs.length;
  const oneStatus = attrsCount === 1;

  if (!attrsCount) {
    return null;
  }

  return (
    <>
      <Button
        variant="contained"
        color="primary"
        onClick={handleMenu}
        className={classes.btngr}
        size="small"
      >
        {itemGr.title}
        {selected}
        {icon}
      </Button>
      <Menu
     //   getContentAnchorEl={null} /does not exist on type 'IntrinsicAttributes & MenuProps'
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        keepMounted
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        open={open}
        onClose={handleClose}
        PaperProps={{
          style: {
            maxHeight: ITEM_HEIGHT * 4.5,
            minWidth: "20ch",
          },
        }}
      >
        {itemGr.attrs.map((item, index) => (
          <MenuItem key={index} dense className={classes.menuitem}>
            <ItemAttr
              itemAttr={item}
              aliasGr={aliasGr}
              color={color}
              sizes={sizes}
              itemSelect={itemSelect}
              oneStatus={oneStatus}
              handleClose={handleClose}
            />
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

export default ItemGrupp;
