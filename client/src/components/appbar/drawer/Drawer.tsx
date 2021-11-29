import {
  useState,
  SyntheticEvent,
  FC,
  TouchEvent,
  KeyboardEvent,
  MouseEvent,
} from "react";
import { Link } from "react-router-dom";
import makeStyles from "@mui/styles/makeStyles";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import ListItemSecondaryAction from "@mui/material/ListItemSecondaryAction";
import HomeIcon from "@mui/icons-material/Home";
import Icon from "@mui/material/Icon";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import FolderIcon from "@mui/icons-material/Folder";
import Collapse from "@mui/material/Collapse";
import CatalogItem from "./catalogitem/CatalogItem";
import Search from "../search/Search";
import {
  AppBarCategoryTreeFragment,
  TTopLinks,
} from "../../../graphql/gqlQuery";
import { RouteNames } from "../../../router";

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

const DrawerApp: FC<DrawerAppProps> = ({
  shop_name_rus,
  categorytreeData,
  topLinks,
}) => {
  const classes = useStyles();

  const [open, setOpen] = useState(false);
  const [gropen, setGrOpen] = useState(false);

  const setCloseDrawer = () => {
    setOpen(false);
  };

  const handleListGClick = (e: SyntheticEvent) => {
    e.stopPropagation();
    setGrOpen((prev) => !prev);
  };

  const toggleDrawer =
    (open: boolean) =>
    (event: TouchEvent | KeyboardEvent | MouseEvent): void => {
      if (
        event.type === "keydown" &&
        ((event as KeyboardEvent).key === "Tab" ||
          (event as KeyboardEvent).key === "Shift")
      ) {
        return;
      }

      setOpen(open);
    };

  const toggleBtnDrawer = () => {
    setOpen((prev) => !prev);
  };

  const ListDrawerApp: FC = () => (
    <>
      <div
        className={classes.list}
        role="presentation"
        onClick={toggleDrawer(false)}
        onKeyDown={toggleDrawer(false)}
      >
        <List>
          <ListItem>
            <ListItemSecondaryAction>
              <IconButton edge="end" onClick={toggleDrawer(false)} size="large">
                <CloseIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
          <ListItem button component={Link} to={RouteNames.MAIN_PAGE}>
            <ListItemIcon>
              <HomeIcon />
            </ListItemIcon>
            <ListItemText primary={shop_name_rus} />
          </ListItem>
          <Divider />
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
        onClick={toggleBtnDrawer}
        size="large"
      >
        <MenuIcon />
      </IconButton>
      <Drawer anchor="left" open={open} onClose={toggleDrawer(false)}>
        <ListDrawerApp />
      </Drawer>
    </>
  );
};

export default DrawerApp;
