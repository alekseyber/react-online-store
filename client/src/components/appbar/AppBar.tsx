import { FC } from "react";
import { Link } from "react-router-dom";
import withWidth, {
  isWidthDown,
  isWidthUp,
  WithWidth,
} from "@material-ui/core/withWidth";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
//import useScrollTrigger from "@material-ui/core/useScrollTrigger";
import { makeStyles } from "@material-ui/core/styles"; //fade, , Theme, Styles
import DrawerApp from "./drawer/Drawer";
import MenuItemBtn from "./menuitem/MenuItem";
import SmallCart from "./smallcart/SmallCart";
import Search from "./search/Search";
import { APP_BAR_QUERY, IAppBar } from "../../graphql/gqlQuery";
import { useQueryApp } from "../../hooks/appolloQueryApp.hook";

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.default,
    color: theme.palette.primary.dark,
    top: "30px",
    zIndex: 5000,
  },
  tollger: {
    flexGrow: 0.1,
  },
  logo: {
    flexGrow: 0.1,
    display: "flex",
    justifyContent: "center",
    [theme.breakpoints.down("sm")]: {
      flexGrow: "0.8",
    },
  },
  logoImg: {
    maxWidth: "110px",
    height: "auto",
  },
  topMenu: {
    flexGrow: 0.2,
    minHeight: "64px",
    display: "flex",
  },
  search: {
    flexGrow: 0.6,
    display: "block",
  },
  smalcart: {
    flexGrow: 0.1,
    minHeight: "64px",
    display: "flex",
    justifyContent: "center",
    marginLeft: theme.spacing(1),
  },
}));

// const options = {
//   threshold: 10,
// };

const AppBarAppF: FC<WithWidth> = ({ width }) => {
  const { data } = useQueryApp<IAppBar>(APP_BAR_QUERY); //loading,

  const classes = useStyles();
  // const trigger = useScrollTrigger(options);
  // position={trigger ? "fixed" : "static"}

  if (!data) return null;
  const baseApiUrl = data.baseApiUrl;
  const { categoryTree, paramsData } = data;

  const { categoryImgProperty, shop_name_rus, topLinks, logoimg } = paramsData;

  const imgStartPatch = baseApiUrl + categoryImgProperty;

  return (
    <AppBar position="fixed" className={classes.root}>
      <Toolbar>
        {isWidthDown("sm", width) && (
          <div className={classes.tollger}>
            <DrawerApp
              shop_name_rus={shop_name_rus}
              categorytreeData={categoryTree}
              topLinks={topLinks}
            />
          </div>
        )}
        <Link to="/" className={classes.logo}>
          <img
            src={baseApiUrl + logoimg}
            className={classes.logoImg}
            alt={shop_name_rus}
          />
        </Link>
        {isWidthUp("md", width) && (
          <div className={classes.topMenu}>
            <MenuItemBtn item={categoryTree} root={true} />
            {categoryTree.childs.map((item) => (
              <MenuItemBtn
                item={item}
                imgStartPatch={imgStartPatch}
                key={item.alias}
              />
            ))}
          </div>
        )}
        {isWidthUp("md", width) && (
          <div className={classes.search}>
            <Search />
          </div>
        )}
        <div className={classes.smalcart}>
          <SmallCart />
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default withWidth()(AppBarAppF);
