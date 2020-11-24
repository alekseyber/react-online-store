import { FC, useState, SyntheticEvent } from "react";
import SortIcon from "@material-ui/icons/Sort";
import IconButton from "@material-ui/core/IconButton";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
import { makeStyles } from "@material-ui/core/styles";
import { SORT_BTN_QUERY, ISortBtn } from "../../graphql/gqlQuery";
import { useQueryApp } from "../../hooks/appolloQueryApp.hook";
import { sortValueVar } from "../../graphql/localVars";

const useStyles = makeStyles((theme) => ({
  root: {
    "& .Mui-selected": {
      backgroundColor: theme.palette.primary.dark,
      color: theme.palette.common.white,
    },
  },
}));

const SortBtn: FC = () => {
  const { data } = useQueryApp<ISortBtn>(SORT_BTN_QUERY);
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState<(EventTarget & HTMLElement) | null>(
    null
  );
  const open = Boolean(anchorEl);
  const sortValue = sortValueVar();
  if (!data) {
    return null;
  }
  const { sortList } = data.sortData;
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMenu = (event: SyntheticEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleSetItem = (value: string) => {
    sortValueVar(value);
    setAnchorEl(null);
  };

  return (
    <div>
      <IconButton onClick={handleMenu} color="inherit">
        <SortIcon />
      </IconButton>
      <Menu
        getContentAnchorEl={null}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        keepMounted
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        open={open}
        onClose={handleClose}
        className={classes.root}
      >
        {sortList.map((item, index) => (
          <MenuItem
            key={index}
            onClick={() => handleSetItem(item._id)}
            selected={item._id === sortValue}
            dense
          >
            {item.text}
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
};

export default SortBtn;
