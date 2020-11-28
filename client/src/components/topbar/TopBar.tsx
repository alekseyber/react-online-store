import { FC } from "react";
import { Link } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import LinkUi from "@material-ui/core/Link";
import Button from "@material-ui/core/Button";
import Divider from "@material-ui/core/Divider";
import Grid from "@material-ui/core/Grid";
import Icon from "@material-ui/core/Icon";
import withWidth, { isWidthUp, WithWidth } from "@material-ui/core/withWidth";
import { openDelivery } from "../../graphql/localVarsModal";
import { TOP_BAR_QUERY, ITopBar } from "../../graphql/gqlQuery";
import { useQueryApp } from "../../hooks/appolloQueryApp.hook";
//import useScrollTrigger from "@material-ui/core/useScrollTrigger";
//import Slide from "@material-ui/core/Slide";

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.primary.dark,
    color: theme.palette.primary.contrastText,
    boxShadow: "none",
    zIndex: 4900,
  },
  wrap: {
    display: "flex",
    justifyContent: "space-between",
    fontWeight: 500,
    minHeight: 33,
    textTransform: "uppercase",
    fontSize: ".75rem",
  },
  phone: {
    fontSize: ".875rem",
  },
  linkIc: {
    alignItems: "center",
    display: "flex",
  },
  divid: {
    backgroundColor: theme.palette.primary.contrastText,
    height: "15px",
    alignSelf: "center",
  },
  icons: {
    marginRight: theme.spacing(1),
  },
  links: {
    width: "fit-content",
    color: theme.palette.primary.contrastText,
    "& > *": {
      marginLeft: theme.spacing(2),
      color: theme.palette.primary.contrastText,
    },
    // "& > button": {
    // },
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
}));

const TopBarAppF: FC<WithWidth> = (props) => {
  const { data } = useQueryApp<ITopBar>(TOP_BAR_QUERY);

  const classes = useStyles();
 // const trigger = useScrollTrigger();

  const deliveryBtnHandler = () => {
    openDelivery();
  };

  if (!data) {
    return null;
  }

  const { phone, topLinks } = data.paramsData;

  return (
    // <Slide appear={false} direction="down" in={!trigger}>
      <AppBar color="inherit" className={classes.root} position="fixed">
        <Toolbar className={classes.wrap}>
          <Grid
            container
            className={classes.links}
            alignItems="center"
            spacing={1}
          >
            <LinkUi
              href={`tel:${phone.href}`}
              color="inherit"
              variant="inherit"
              className={classes.phone}
            >
              {phone.title}
            </LinkUi>
            <Divider
              orientation="vertical"
              className={classes.divid}
              flexItem
            />
            <Button onClick={deliveryBtnHandler}>{data.cityNameCurrent}</Button>
          </Grid>
          {isWidthUp("md", props.width) && (
            <Grid
              container
              className={classes.links}
              alignItems="center"
              spacing={1}
            >
              {topLinks.map((item, index) => (
                <LinkUi
                  key={index}
                  component={Link}
                  to={item.url}
                  color="inherit"
                  variant="inherit"
                  className={classes.linkIc}
                >
                  <Icon fontSize="small" className={classes.icons}>
                    {item.icons}
                  </Icon>
                  {item.title}
                </LinkUi>
              ))}
            </Grid>
          )}
        </Toolbar>
      </AppBar>
    // </Slide>
  );
};

export default withWidth()(TopBarAppF);
