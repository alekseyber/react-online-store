import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import LinkUi from "@material-ui/core/Link";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Divider from "@material-ui/core/Divider";
import Grid from "@material-ui/core/Grid";
import withWidth, { isWidthUp } from "@material-ui/core/withWidth";
import Container from "@material-ui/core/Container";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
import Collapse from "@material-ui/core/Collapse";
import PhoneIcon from "@material-ui/icons/Phone";
import AlternateEmailIcon from "@material-ui/icons/AlternateEmail";
import RoomIcon from "@material-ui/icons/Room";
import ChatBubbleOutlineIcon from "@material-ui/icons/ChatBubbleOutline";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";
import { openReturnCall } from "../../redux/actions/modaldialog";
import { APP_FOOTER_QUERY } from "../../graphql/gqlQuery";
import { useQueryApp } from "../../hooks/appolloQueryApp.hook";

const useStyles = makeStyles((theme) => ({
  footer: {
    backgroundColor: theme.palette.background.dark,
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
  },
  copyright: {
    paddingTop: theme.spacing(2),
  },
  footerBody: {
    paddingBottom: theme.spacing(2),
    "& .MuiCollapse-container": {
      marginTop: theme.spacing(1),
      padding: theme.spacing(1),
    },
  },
  title: {
    [theme.breakpoints.down("sm")]: {
      cursor: "pointer",
    },
  },
  item: {
    padding: `${theme.spacing(1)}px  0`,
    "& .MuiSvgIcon-root": {
      marginRight: theme.spacing(1),
    },
    "& a:hover": {
      textDecoration: "none",
      fontWeight: 700,
    },
    "& .MuiButton-label:hover": {
      fontWeight: 700,
    },
  },
}));

const AppFooterF = ({ width }) => {
  const { data } = useQueryApp(APP_FOOTER_QUERY);
  const dispatch = useDispatch();
  const classes = useStyles();

  const [state, setState] = useState({
    0: false,
    1: false,
    2: false,
  });

  if (!data) {
    return null;
  }

  const {
    shop_fullname_rus,
    phone,
    shop_email,
    streetAddress,
    bottomLinks,
  } = data.paramsData;

  const toggleList = (anchor) => () => {
    setState({ ...state, [anchor]: !state[anchor] });
  };

  //const preventDefault = (event) => event.preventDefault();

  const commetBtnHandler = () => {
    dispatch(openReturnCall());
  };

  const Expand = (anchor) => {
    if (isWidthUp("md", width)) return null;
    return <>{state[anchor] ? <ExpandLess /> : <ExpandMore />}</>;
  };

  const Copyright = () => (
    <Typography
      variant="body2"
      color="inherit"
      align="left"
      className={classes.copyright}
    >
      {"© "}
      {shop_fullname_rus} {new Date().getFullYear()}
      {"."}
    </Typography>
  );

  return (
    <footer className={classes.footer}>
      <Container fixed>
        <Grid container className={classes.footerBody} spacing={2}>
          <Grid item xs={12} md={6}>
            <Typography
              variant="h6"
              color="inherit"
              component="div"
              noWrap
              onClick={toggleList(0)}
              className={classes.title}
            >
              Контакты {Expand(0)}
            </Typography>
            <Collapse
              in={state[0] || isWidthUp("md", width)}
              timeout="auto"
              unmountOnExit
            >
              <div className={classes.item}>
                <PhoneIcon fontSize="small" />
                <LinkUi color="inherit" href={`tel:${phone.href}`}>
                  {phone.title}
                </LinkUi>
              </div>
              <div className={classes.item}>
                <AlternateEmailIcon fontSize="small" />
                <LinkUi
                  color="inherit"
                  href={`mailto:${shop_email}`}
                  target="_blank"
                >
                  {shop_email}
                </LinkUi>
              </div>
              <div className={classes.item}>
                <RoomIcon fontSize="small" />
                <span>{streetAddress}</span>
              </div>
              <div className={classes.item}>
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
                onClick={toggleList(index + 1)}
                className={classes.title}
              >
                {item.title} {Expand(1)}
              </Typography>
              <Collapse
                in={state[index + 1] || isWidthUp("md", width)}
                timeout="auto"
                unmountOnExit
              >
                {item.list.map((itemList, key) => (
                  <div className={classes.item} key={key}>
                    <ArrowForwardIcon fontSize="small" />
                    <LinkUi color="inherit" component={Link} to={itemList.url}>
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
    </footer>
  );
};

export default withWidth()(AppFooterF);
