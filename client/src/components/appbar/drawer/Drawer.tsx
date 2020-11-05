import React, { useState } from "react";
import { Link } from "react-router-dom";
//import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import List from "@material-ui/core/List";
import Divider from "@material-ui/core/Divider";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import HomeIcon from "@material-ui/icons/Home";
import Icon from "@material-ui/core/Icon";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
import FolderIcon from "@material-ui/icons/Folder";
import Collapse from "@material-ui/core/Collapse";
import CatalogItem from "./catalogitem/CatalogItem";
import Search from "../search/Search";
import {
  AppBarCategoryTreeFragment,
  TTopLinks,
} from "../../../graphql/gqlQuery";

const useStyles = makeStyles((theme) => ({
  list: {
    width: 250,
  },
  search: {
    padding: "10px",
  },
  nested: {
    paddingLeft: theme.spacing(4),
  },
}));

interface DrawerAppProps {
  categorytreeData: AppBarCategoryTreeFragment;
  topLinks: TTopLinks[];
  shop_name_rus: string;
}

const DrawerApp: React.FC<DrawerAppProps> = ({
  shop_name_rus,
  categorytreeData,
  topLinks,
}) => {
  const classes = useStyles();

  const [open, setOpen] = useState(false);
  const [gropen, setGrOpen] = useState(false);

  // const setOpenCallback = useCallback((open) => {
  //   setOpen(open);
  // }, []);

  const setCloseDrawer = () => {
    setOpen(false);
  };

  const handleListGClick = (e: React.SyntheticEvent) => {
    e.stopPropagation();
    setGrOpen((prev) => !prev);
  };

  const toggleDrawer = (open: boolean) => (
    event: React.TouchEvent | React.KeyboardEvent | React.MouseEvent
  ): void => {
    if (
      event.type === "keydown" &&
      ((event as React.KeyboardEvent).key === "Tab" ||
        (event as React.KeyboardEvent).key === "Shift")
    ) {
      return;
    }

    setOpen(open);
  };

  const ListDrawerApp: React.FC = () => (
    <>
      <div
        className={classes.list}
        role="presentation"
        onClick={toggleDrawer(false)}
        onKeyDown={toggleDrawer(false)}
      >
        <List>
          <ListItem button component={Link} to="/">
            <ListItemIcon>
              <HomeIcon />
            </ListItemIcon>
            <ListItemText primary={shop_name_rus} />
          </ListItem>
          <ListItem button onClick={handleListGClick}>
            <ListItemIcon>
              <FolderIcon />
            </ListItemIcon>
            <ListItemText primary="Каталог" />
            {gropen ? <ExpandLess /> : <ExpandMore />}
          </ListItem>
          <Collapse in={gropen} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <CatalogItem item={categorytreeData} root={true} />
              {categorytreeData.childs.map((item) => (
                <CatalogItem item={item} key={item.alias} />
              ))}
            </List>
          </Collapse>
        </List>
        <Divider />
        <List>
          {topLinks.map((item, index) => (
            <ListItem
              button
              key={index + "topl"}
              component={Link}
              to={item.url}
            >
              <ListItemIcon>
                <Icon fontSize="small">{item.icons}</Icon>
              </ListItemIcon>
              <ListItemText primary={item.title} />
            </ListItem>
          ))}
        </List>
        <Divider />
      </div>
      <div className={classes.search}>
        <Search fclose={setCloseDrawer} />
      </div>
    </>
  );

  return (
    <>
      <IconButton
        edge="start"
        color="inherit"
        aria-label="open drawer"
        onClick={toggleDrawer(true)}
      >
        <MenuIcon />
      </IconButton>
      <Drawer anchor="left" open={open} onClose={toggleDrawer(false)}>
        <ListDrawerApp />
      </Drawer>
    </>
  );
};

// DrawerApp.defaultProps = {
//     root: false,
//     imgStartPatch: ''
// };

// DrawerApp.propTypes = {
//   topLinks: PropTypes.array.isRequired,
//   categorytreeData: PropTypes.object.isRequired,
//   shop_name_rus: PropTypes.string.isRequired,
// };

export default DrawerApp;
