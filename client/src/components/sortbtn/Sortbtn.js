import React from "react";
import SortIcon from "@material-ui/icons/Sort";
import IconButton from "@material-ui/core/IconButton";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
import { useSelector, useDispatch } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import { setSortValueApp } from "../../redux/actions/app";
import { SORT_BTN_QUERY } from "../../graphql/gqlQuery";
import { useQueryApp } from "../../hooks/appolloQueryApp.hook";

const useStyles = makeStyles((theme) => ({
  root: {
    "& .Mui-selected": {
      backgroundColor: theme.palette.primary.dark,
      color: theme.palette.common.white,
    },
  },
}));

const SortBtn = () => {
  const { data } = useQueryApp(SORT_BTN_QUERY);
  const sortValue = useSelector((state) => state.app.sortValue);
  const classes = useStyles();
  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  if (!data) {
    return null;
  }
  const { sortList } = data.sortData;
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleSetItem = (value) => {
    dispatch(setSortValueApp(value));

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
            selected={String(item._id) === String(sortValue)}
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
