import React from "react";
//import PropTypes from "prop-types";
//import { Link } from "react-router-dom";
import Button from "@material-ui/core/Button";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import Popover from "@material-ui/core/Popover";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import CardActionArea from "@material-ui/core/CardActionArea";
import { Image } from "../../image/Image";
import {
  AppBarCategoryTreeFragment,
  TCategoryTreeChilds,
} from "../../../graphql/gqlQuery";
import { useRouter } from "../../../hooks/router.hook";

const MenuButton = withStyles((theme) => ({
  root: {
    fontWeight: 700,
    // padding: "0 16px",
    fontSize: ".875rem",
    minWidth: "64px",
    minHeight: "100%",
    marginRight: theme.spacing(2),
    [theme.breakpoints.down("md")]: {
      marginRight: theme.spacing(1),
      //  fontSize: ".8rem",
    },
  },
}))(Button);

const useStyles = makeStyles((theme) => ({
  root: {
    //flexGrow: 1,
    padding: theme.spacing(2),
    overflowY: "hidden",
  },
  cardRoot: {
    "&:hover": {
      boxShadow:
        "0 5px 5px -3px rgba(0,0,0,.2), 0 8px 10px 1px rgba(0,0,0,.14), 0 3px 14px 2px rgba(0,0,0,.12)",
    },
    width: "255px",
    display: "block",
    transition: "box-shadow .4s cubic-bezier(.25,.8,.25,1)",
    transitionProperty: "box-shadow",
    transitionDuration: "0.4s",
    transitionTimingFunction: "cubic-bezier(0.25, 0.8, 0.25, 1)",
    transitionDelay: "0s",
    textDecoration: "none",
  },
  control: {
    padding: theme.spacing(2),
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

const StyledPopover = withStyles({
  root: {
    minHeight: "100%",
  },
})(Popover);

interface MenuItemBtnProps {
  root?: boolean;
  item: AppBarCategoryTreeFragment | TCategoryTreeChilds;
  imgStartPatch?: string;
}

interface ItemCardProps {
  cat: AppBarCategoryTreeFragment | TCategoryTreeChilds;
  all?: boolean;
}

const MenuItemBtn: React.FC<MenuItemBtnProps> = ({
  root = false,
  item,
  imgStartPatch = "",
}) => {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState<
    (EventTarget & HTMLElement) | null
  >(null);
  const history = useRouter();

  const handleClick = (event: React.SyntheticEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (): void => {
    setAnchorEl(null);
  };

  const handleTo = (to: string): void => {
    history.push("/category/" + to);
    handleClose();
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  if (root || item.childs.length === 0) {
    return (
      <MenuButton size="medium" onClick={() => handleTo(item.alias)}>
        {item.title}
      </MenuButton>
    );
  }

  const icon = (
    <ExpandMoreIcon
      fontSize="small"
      className={clsx(classes.expand, {
        [classes.expandOpen]: anchorEl,
      })}
    />
  );

  const ItemCard: React.FC<ItemCardProps> = ({ cat, all = false }) => {
    const title = all ? "Все " + cat.title.toLowerCase() : cat.title;

    return (
      <Grid item>
        <Card
          className={classes.cardRoot}
          // component={Link}
          // to={"/category/" + cat.alias}
          onClick={() => handleTo(cat.alias)}
        >
          <CardActionArea>
            <CardMedia>
              <Image src={imgStartPatch + cat.img} alt={cat.title} />
            </CardMedia>
            <CardContent>
              <Typography gutterBottom variant="h6" component="div">
                {title}
              </Typography>
            </CardContent>
          </CardActionArea>
        </Card>
      </Grid>
    );
  };

  return (
    <div>
      <MenuButton
        size="medium"
        aria-describedby={id}
        color="inherit"
        onClick={handleClick}
      >
        {item.title}
        {icon}
      </MenuButton>
      <StyledPopover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
      >
        <Grid container className={classes.root} spacing={2}>
          <ItemCard cat={item} all={true} />
          {item.childs.map((cat) => (
            <ItemCard key={cat.alias} cat={cat} />
          ))}
        </Grid>
      </StyledPopover>
    </div>
  );
};

// MenuItemBtn.defaultProps = {
//   root: false,
//   imgStartPatch: "",
// };

// MenuItemBtn.propTypes = {
//   root: PropTypes.bool,
//   item: PropTypes.object.isRequired,
//   imgStartPatch: PropTypes.string,
// };

export default MenuItemBtn;
