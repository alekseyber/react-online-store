import { useState, FC, SyntheticEvent } from "react";
import { Link } from "react-router-dom";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Collapse from "@mui/material/Collapse";
import makeStyles from "@mui/styles/makeStyles";
import {
  AppBarCategoryTreeFragment,
  TCategoryTreeChilds,
} from "../../../../graphql/gqlQuery";
import { getLinkByRoutePath } from "../../../../router";

const useStyles = makeStyles((theme) => ({
  nested: {
    paddingLeft: theme.spacing(4),
  },
}));

interface CatalogItemProps {
  item: AppBarCategoryTreeFragment | TCategoryTreeChilds;
  root?: boolean;
}

const CatalogItem: FC<CatalogItemProps> = ({ root = false, item }) => {
  const [gropen, setGrOpen] = useState(false);

  const classes = useStyles();

  const handleListGClick = (e: SyntheticEvent) => {
    e.stopPropagation();
    setGrOpen(!gropen);
  };

  if (root || item.childs.length === 0 || !item.childs) {
    return (
      <ListItem
        button
        component={Link}
        to={getLinkByRoutePath("CATEGORY_PAGE", item.alias)}
      >
        <ListItemText primary={item.title} />
      </ListItem>
    );
  }

  const titleAll = "Все " + item.title.toLowerCase();

  return (
    <>
      <ListItem button onClick={handleListGClick}>
        <ListItemText primary={item.title} />
        {gropen ? <ExpandLess /> : <ExpandMore />}
      </ListItem>
      <Collapse in={gropen} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          <ListItem
            button
            className={classes.nested}
            component={Link}
            to={getLinkByRoutePath("CATEGORY_PAGE", item.alias)}
          >
            <ListItemText primary={titleAll} />
          </ListItem>
          {item.childs.map((itemEl, index) => (
            <ListItem
              button
              key={index + "left"}
              className={classes.nested}
              component={Link}
              to={getLinkByRoutePath("CATEGORY_PAGE", itemEl.alias)}
            >
              <ListItemText primary={itemEl.title} />
            </ListItem>
          ))}
        </List>
      </Collapse>
    </>
  );
};

export default CatalogItem;
