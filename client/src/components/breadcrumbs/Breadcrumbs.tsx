import React from "react";
import { Link, useHistory } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import LinkUi from "@material-ui/core/Link";
import HomeIcon from "@material-ui/icons/Home";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import { TBreadcrumb } from "../../graphql/gqlQuery";
//import PropTypes from "prop-types";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(2),
  },
  link: {
    display: "flex",
  },
  icon: {
    marginRight: theme.spacing(0.5),
    width: 20,
    height: 20,
  },
  backbtn: {
    marginLeft: theme.spacing(2),
  },
}));

interface IPageBaseProps {
  breadcrumbsData: TBreadcrumb[];
}

interface ItemProps {
  el: TBreadcrumb;
}

const Item: React.FC<ItemProps> = ({ el }) => {
  if (el.disabled) {
    return <Typography color="textPrimary">{el.text}</Typography>;
  }
  return (
    <LinkUi color="inherit" component={Link} to={el.href}>
      {el.text}
    </LinkUi>
  );
};

export const AppBreadcrumbs: React.FC<IPageBaseProps> = ({
  breadcrumbsData,
}) => {
  const classes = useStyles();
  const history = useHistory();

  const handleBackClick = () => {
    history.goBack();
  };

  return (
    <div className={classes.root}>
      <Breadcrumbs>
        <LinkUi
          color="inherit"
          component={Link}
          to="/"
          className={classes.link}
        >
          <HomeIcon className={classes.icon} />
        </LinkUi>
        {breadcrumbsData.map((el, index) => (
          <Item key={index} el={el} />
        ))}
      </Breadcrumbs>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={handleBackClick}
        className={classes.backbtn}
      >
        Назад
      </Button>
    </div>
  );
};

// AppBreadcrumbs.propTypes = {
//   breadcrumbsData: PropTypes.array.isRequired,
// };

export default AppBreadcrumbs;
