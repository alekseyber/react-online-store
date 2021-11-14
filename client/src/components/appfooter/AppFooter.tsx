import { useState, FC } from "react";
import { Link } from "react-router-dom";
//import makeStyles from "@mui/styles/makeStyles";
import { styled, Theme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import LinkUi from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import Container from "@mui/material/Container";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import Collapse from "@mui/material/Collapse";
import PhoneIcon from "@mui/icons-material/Phone";
import AlternateEmailIcon from "@mui/icons-material/AlternateEmail";
import RoomIcon from "@mui/icons-material/Room";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { openReturnCall } from "../../graphql/localVarsModal";
import { APP_FOOTER_QUERY, IAppFooter } from "../../graphql/gqlQuery";
import { useQueryApp } from "../../hooks/appolloQueryApp.hook";

const CssFooter = styled("footer")(({ theme }) => ({
  //  backgroundColor: theme.palette.background.dark,
  backgroundColor: theme.palette.darkprimary.main,
  padding: theme.spacing(2),
  marginTop: theme.spacing(3),
  color: theme.palette.primary.contrastText,
  "& .MuiDivider-root": {
    backgroundColor: theme.palette.primary.contrastText,
  },
  "& .MuiSvgIcon-root": {
    verticalAlign: "middle",
  },
  "& .MuiButton-label": {
    textTransform: "none",
    lineHeight: "normal",
  },
  "& .appFooter-copyright": {
    paddingTop: theme.spacing(2),
  },
  "& .appFooter-footerBody": {
    paddingBottom: theme.spacing(2),
    "& .MuiCollapse-root": {
      marginTop: theme.spacing(1),
      padding: theme.spacing(1),
    },
  },
  "& .appFooter-title": {
    [theme.breakpoints.down("md")]: {
      cursor: "pointer",
    },
  },
  "& .MuiCollapse-wrapperInner > div": {
    padding: `${theme.spacing(1)}  0`,
    "& .MuiSvgIcon-root": {
      marginRight: theme.spacing(1),
    },
    "& a:hover": {
      //textDecoration: "none",
      fontWeight: 700,
    },
    "& .MuiButton-label:hover": {
      fontWeight: 700,
    },
  },
}));

//const useStyles = makeStyles((theme) => ({
// footer: {
//   //  backgroundColor: theme.palette.background.dark,
//   backgroundColor: theme.palette.darkprimary.main,
//   padding: theme.spacing(2),
//   marginTop: theme.spacing(3),
//   color: theme.palette.primary.contrastText,
//   "& .MuiDivider-root": {
//     backgroundColor: theme.palette.primary.contrastText,
//   },
//   "& .MuiSvgIcon-root": {
//     verticalAlign: "middle",
//   },
//   "& .MuiButton-label": {
//     textTransform: "none",
//     lineHeight: "normal",
//   },
// },
// copyright: {
//   paddingTop: theme.spacing(2),
// },
// footerBody: {
//   paddingBottom: theme.spacing(2),
//   "& .MuiCollapse-root": {
//     marginTop: theme.spacing(1),
//     padding: theme.spacing(1),
//   },
// },
// title: {
//   [theme.breakpoints.down("md")]: {
//     cursor: "pointer",
//   },
// },
// item: {
// padding: `${theme.spacing(1)}  0`,
// "& .MuiSvgIcon-root": {
//   marginRight: theme.spacing(1),
// },
// "& a:hover": {
//   textDecoration: "none",
//   fontWeight: 700,
// },
// "& .MuiButton-label:hover": {
//   fontWeight: 700,
// },
//  },
//}));

interface IState {
  0: boolean;
  1: boolean;
  2: boolean;
}

type TAnchor = 0 | 1 | 2;

const AppFooter: FC = () => {
  const { data } = useQueryApp<IAppFooter>(APP_FOOTER_QUERY);
  const isWidthUpMd = useMediaQuery((theme: Theme) =>
    theme.breakpoints.up("md")
  );

  // const classes = useStyles();

  const [state, setState] = useState<IState>({
    0: false,
    1: false,
    2: false,
  });

  if (!data) {
    return null;
  }

  const { shop_fullname_rus, phone, shop_email, streetAddress, bottomLinks } =
    data.paramsData;

  const toggleList = (anchor: TAnchor) => () => {
    setState((prev) => ({ ...prev, [anchor]: !state[anchor] }));
  };

  //const preventDefault = (event) => event.preventDefault();

  const commetBtnHandler = () => {
    openReturnCall();
  };

  const Expand = (anchor: TAnchor) => {
    if (isWidthUpMd) return null;
    return <>{state[anchor] ? <ExpandLess /> : <ExpandMore />}</>;
  };

  const Copyright = () => (
    <Typography
      variant="body2"
      color="inherit"
      align="left"
      className="appFooter-copyright"
    >
      {"© "}
      {shop_fullname_rus} {new Date().getFullYear()}
      {"."}
    </Typography>
  );

  return (
    <CssFooter>
      <Container fixed maxWidth="xl">
        <Grid container className="appFooter-footerBody" spacing={2}>
          <Grid item xs={12} md={6}>
            <Typography
              variant="h6"
              color="inherit"
              component="div"
              noWrap
              onClick={toggleList(0)}
              className="appFooter-title"
            >
              Контакты {Expand(0)}
            </Typography>
            <Collapse in={state[0] || isWidthUpMd} timeout="auto" unmountOnExit>
              <div>
                <PhoneIcon fontSize="small" />
                <LinkUi
                  color="inherit"
                  href={`tel:${phone.href}`}
                  underline="none"
                >
                  {phone.title}
                </LinkUi>
              </div>
              <div>
                <AlternateEmailIcon fontSize="small" />
                <LinkUi
                  color="inherit"
                  underline="hover"
                  href={`mailto:${shop_email}`}
                  target="_blank"
                >
                  {shop_email}
                </LinkUi>
              </div>
              <div>
                <RoomIcon fontSize="small" />
                <span>{streetAddress}</span>
              </div>
              <div>
                <ChatBubbleOutlineIcon fontSize="small" />
                <Button onClick={commetBtnHandler} color="inherit">
                  Задать вопрос
                </Button>
              </div>
            </Collapse>
          </Grid>
          {bottomLinks.map((item, index) => (
            <Grid item xs={12} md={3} key={index + "footgr"}>
              <Typography
                variant="h6"
                color="inherit"
                component="div"
                noWrap
                onClick={toggleList((index + 1) as TAnchor)}
                className="appFooter-title"
              >
                {item.title} {Expand(1)}
              </Typography>
              <Collapse
                in={state[(index + 1) as TAnchor] || isWidthUpMd}
                timeout="auto"
                unmountOnExit
              >
                {item.list.map((itemList, key) => (
                  <div key={key}>
                    <ArrowForwardIcon fontSize="small" />
                    <LinkUi
                      color="inherit"
                      component={Link}
                      to={itemList.url}
                      underline="hover"
                    >
                      {itemList.title}
                    </LinkUi>
                  </div>
                ))}
              </Collapse>
            </Grid>
          ))}
        </Grid>
        <Divider />
        <Copyright />
      </Container>
    </CssFooter>
  );
};

export default AppFooter;
