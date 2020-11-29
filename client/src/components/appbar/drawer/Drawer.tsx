import {
  useState,
  SyntheticEvent,
  FC,
  TouchEvent,
  KeyboardEvent,
  MouseEvent,
} from "react";
import { Link } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import CloseIcon from "@material-ui/icons/Close";
import List from "@material-ui/core/List";
import Divider from "@material-ui/core/Divider";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
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

  const toggleDrawer = (open: boolean) => (
    event: TouchEvent | KeyboardEvent | MouseEvent
  ): void => {
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
              <IconButton edge="end" onClick={toggleDrawer(false)}>
                <CloseIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
          <ListItem button component={Link} to="/">
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
