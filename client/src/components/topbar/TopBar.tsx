import { FC } from "react";
import { Link } from "react-router-dom";
import { styled } from "@mui/material/styles";
import { Theme, useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import LinkUi from "@mui/material/Link";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import Icon from "@mui/material/Icon";
import { openDelivery } from "../../graphql/localVarsModal";
import { TOP_BAR_QUERY, ITopBar } from "../../graphql/gqlQuery";
import { useQueryApp } from "../../hooks/appolloQueryApp.hook";

const CssAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: theme.palette.primary.dark,
  color: theme.palette.primary.contrastText,
  boxShadow: "none",
  "& .topbar-wrap": {
    display: "flex",
    justifyContent: "space-between",
    fontWeight: 500,
    minHeight: 33,
    textTransform: "uppercase",
    fontSize: ".75rem",
  },
  "& .topbar-wrap-links": {
    width: "fit-content",
    color: theme.palette.primary.contrastText,
    "& > *": {
      marginLeft: theme.spacing(2),
      color: theme.palette.primary.contrastText,
    },
    margin: 0,
    "& > a:hover": {
      fontWeight: 600,
      textDecoration: "none",
    },
    "& > a": {
      textDecoration: "none",
    },
    "& > button:hover": {
      fontWeight: 600,
    },
  },
  "& .topbar-wrap-phone": {
    fontSize: ".875rem",
  },
  "& .topbar-wrap-divid": {
    backgroundColor: theme.palette.primary.contrastText,
    height: "15px",
    alignSelf: "center",
  },
  "& .topbar-wrap-linkicons": {
    alignItems: "center",
    display: "flex",
  },
  "& .topbar-wrap-icons": {
    marginRight: theme.spacing(1),
  },
}));

//const useStyles = makeStyles((theme) => ({
// root: {
//   backgroundColor: theme.palette.primary.dark,
//   color: theme.palette.primary.contrastText,
//   boxShadow: "none",
// },
// wrap: {
//   display: "flex",
//   justifyContent: "space-between",
//   fontWeight: 500,
//   minHeight: 33,
//   textTransform: "uppercase",
//   fontSize: ".75rem",
// },
// phone: {
//   fontSize: ".875rem",
// },
// linkIc: {
//   alignItems: "center",
//   display: "flex",
// },
// divid: {
//   backgroundColor: theme.palette.primary.contrastText,
//   height: "15px",
//   alignSelf: "center",
// },
// icons: {
//   marginRight: theme.spacing(1),
// },
// links: {
//   width: "fit-content",
//   color: theme.palette.primary.contrastText,
//   "& > *": {
//     marginLeft: theme.spacing(2),
//     color: theme.palette.primary.contrastText,
//   },
//   margin: 0,
//   // "& > button": {
//   // },
//   "& > a:hover": {
//     fontWeight: 600,
//     textDecoration: "none",
//   },
//   "& > a": {
//     textDecoration: "none",
//   },
//   "& > button:hover": {
//     fontWeight: 600,
//   },
// },
//}));

const TopBarApp: FC = () => {
  const { data } = useQueryApp<ITopBar>(TOP_BAR_QUERY);

  const theme: Theme = useTheme();
  const isWidthUpMd = useMediaQuery(theme.breakpoints.up("md"));

  const deliveryBtnHandler = () => {
    openDelivery();
  };

  if (!data) {
    return null;
  }

  const { phone, topLinks } = data.paramsData;

  return (
    <CssAppBar color="inherit" position="relative">
      <Toolbar className="topbar-wrap">
        <Grid
          container
          className="topbar-wrap-links"
          alignItems="center"
          spacing={1}
        >
          <LinkUi
            href={`tel:${phone.href}`}
            color="inherit"
            variant="inherit"
            className="topbar-wrap-phone"
          >
            {phone.title}
          </LinkUi>
          <Divider
            orientation="vertical"
            className="topbar-wrap-divid"
            flexItem
          />
          <Button onClick={deliveryBtnHandler}>{data.cityNameCurrent}</Button>
        </Grid>
        {isWidthUpMd && (
          <Grid
            container
            className="topbar-wrap-links"
            alignItems="center"
            spacing={1}
          >
            {topLinks.map((item, index) => (
              <LinkUi
                key={index + item.url}
                component={Link}
                to={item.url}
                color="inherit"
                variant="inherit"
                className="topbar-wrap-linkicons"
              >
                <Icon fontSize="small" className="topbar-wrap-icons">
                  {item.icons}
                </Icon>
                {item.title}
              </LinkUi>
            ))}
          </Grid>
        )}
      </Toolbar>
    </CssAppBar>
  );
};

export default TopBarApp;
