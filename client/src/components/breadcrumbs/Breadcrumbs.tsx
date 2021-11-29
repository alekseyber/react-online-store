import { FC } from "react";
import { Link, useNavigate } from "react-router-dom";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import LinkUi from "@mui/material/Link";
import HomeIcon from "@mui/icons-material/Home";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { TBreadcrumb } from "../../graphql/gqlQuery";
import { styled } from "@mui/material/styles";
import { RouteNames } from "../../router";

const CssRootDiv = styled("div")(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginTop: theme.spacing(3),
  marginBottom: theme.spacing(2),
  "& .appBreadcrumbs-link": {
    display: "flex",
  },
  "& .appBreadcrumbs-icon": {
    marginRight: theme.spacing(0.5),
    width: 20,
    height: 20,
  },
  "& .appBreadcrumbs-backbtn": {
    marginLeft: theme.spacing(2),
  },
}));

// const useStyles = makeStyles((theme) => ({
//   root: {
//     display: "flex",
//     justifyContent: "space-between",
//     alignItems: "center",
//     marginTop: theme.spacing(3),
//     marginBottom: theme.spacing(2),
//   },
//   link: {
//     display: "flex",
//   },
//   icon: {
//     marginRight: theme.spacing(0.5),
//     width: 20,
//     height: 20,
//   },
//   backbtn: {
//     marginLeft: theme.spacing(2),
//   },
// }));

interface IPageBaseProps {
  breadcrumbsData: TBreadcrumb[];
}

interface ItemProps {
  el: TBreadcrumb;
}

const Item: FC<ItemProps> = ({ el }) => {
  if (el.disabled) {
    return <Typography color="textPrimary">{el.text}</Typography>;
  }
  return (
    <LinkUi color="inherit" component={Link} to={el.href}>
      {el.text}
    </LinkUi>
  );
};

export const AppBreadcrumbs: FC<IPageBaseProps> = ({ breadcrumbsData }) => {
  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate(-1);
  };

  return (
    <CssRootDiv>
      <Breadcrumbs>
        <LinkUi
          color="inherit"
          component={Link}
          to={RouteNames.MAIN_PAGE}
          className="appBreadcrumbs-link"
        >
          <HomeIcon className="appBreadcrumbs-icon" />
        </LinkUi>
        {breadcrumbsData.map((el, index) => (
          <Item key={index} el={el} />
        ))}
      </Breadcrumbs>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={handleBackClick}
        className="appBreadcrumbs-backbtn"
      >
        Назад
      </Button>
    </CssRootDiv>
  );
};

export default AppBreadcrumbs;
