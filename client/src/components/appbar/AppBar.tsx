import { FC } from "react"; //, ReactElement, cloneElement
import { Link } from "react-router-dom";
//import useScrollTrigger from "@mui/material/useScrollTrigger";
import { Theme, useTheme } from "@mui/material/styles";
import { styled } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import DrawerApp from "./drawer/Drawer";
import MenuItemBtn from "./menuitem/MenuItem";
import SmallCart from "./smallcart/SmallCart";
import Search from "./search/Search";
import { APP_BAR_QUERY, IAppBar } from "../../graphql/gqlQuery";
import { useQueryApp } from "../../hooks/appolloQueryApp.hook";

const CssAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  color: theme.palette.primary.dark,
  "& .appbar-tollger": {
    flexGrow: 0.1,
  },
  "& .appbar-logo": {
    flexGrow: 0.1,
    display: "flex",
    justifyContent: "center",
    [theme.breakpoints.down("md")]: {
      flexGrow: 0.8,
    },
  },
  "& .appbar-logoimg": {
    maxWidth: "110px",
    height: "auto",
  },
  "& .appbar-topmenu": {
    flexGrow: 0.2,
    minHeight: "64px",
    display: "flex",
  },
  "& .appbar-search": {
    flexGrow: 0.6,
    display: "block",
  },
  "& .appbar-smalcart": {
    flexGrow: 0.1,
    minHeight: "64px",
    display: "flex",
    justifyContent: "center",
    marginLeft: theme.spacing(1),
  },
}));

//const useStyles = makeStyles((theme) => ({
// root: {
//   backgroundColor: theme.palette.background.default,
//   color: theme.palette.primary.dark,
// },
// tollger: {
//   flexGrow: 0.1,
// },
// logo: {
//   flexGrow: 0.1,
//   display: "flex",
//   justifyContent: "center",
//   [theme.breakpoints.down("md")]: {
//     flexGrow: "0.8",
//   },
// },
// logoImg: {
//   maxWidth: "110px",
//   height: "auto",
// },
// topMenu: {
//   flexGrow: 0.2,
//   minHeight: "64px",
//   display: "flex",
// },
// search: {
// flexGrow: 0.6,
// display: "block",
// },
// smalcart: {
//   flexGrow: 0.1,
//   minHeight: "64px",
//   display: "flex",
//   justifyContent: "center",
//   marginLeft: theme.spacing(1),
// },
//}));

// const options = {
//   threshold: 10,
// };

// interface Props {
//   /**
//    * Injected by the documentation to work in an iframe.
//    * You won't need it on your project.
//    */
//   window?: () => Window;
//   children: ReactElement;
// }

// function ElevationScroll(props: Props) {
//   const { children, window } = props;
//   // Note that you normally won't need to set the window ref as useScrollTrigger
//   // will default to window.
//   // This is only being set here because the demo is in an iframe.
//   const trigger = useScrollTrigger({
//     disableHysteresis: true,
//     threshold: 0,
//     target: window ? window() : undefined,
//   });

//   return cloneElement(children, {
//     position: trigger ? "fixed" : "static",
//   });
// }

const AppBarApp: FC = () => {
  const { data } = useQueryApp<IAppBar>(APP_BAR_QUERY); //loading,

  const theme: Theme = useTheme();
  const isWidthDownMd = useMediaQuery(theme.breakpoints.down("md"));
  const isWidthUpMd = useMediaQuery(theme.breakpoints.up("md"));

  // const trigger = useScrollTrigger(options);
  // position={trigger ? "fixed" : "static"}

  if (!data) return null;
  const baseApiUrl = data.baseApiUrl;
  const { categoryTree, paramsData } = data;

  const { categoryImgProperty, shop_name_rus, topLinks, logoimg } = paramsData;

  const imgStartPatch = baseApiUrl + categoryImgProperty;

  return (
    <CssAppBar position="sticky">
      <Toolbar>
        {isWidthDownMd && (
          <div className="appbar-tollger">
            <DrawerApp
              shop_name_rus={shop_name_rus}
              categorytreeData={categoryTree}
              topLinks={topLinks}
            />
          </div>
        )}
        <Link to="/" className="appbar-logo">
          <img
            src={baseApiUrl + logoimg}
            className="appbar-logoimg"
            alt={shop_name_rus}
          />
        </Link>
        {isWidthUpMd && (
          <div className="appbar-topmenu">
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
        {isWidthUpMd && (
          <div className="appbar-search">
            <Search />
          </div>
        )}
        <div className="appbar-smalcart">
          <SmallCart />
        </div>
      </Toolbar>
    </CssAppBar>
  );
};

export default AppBarApp;
