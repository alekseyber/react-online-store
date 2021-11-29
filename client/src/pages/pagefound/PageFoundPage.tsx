import { FC } from "react";
import { Link } from "react-router-dom";
import { styled } from "@mui/material/styles";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { PageBase } from "../../hoc/PageBase";
import { BASE_API_URL_QUERY, IBaseApiUrl } from "../../graphql/gqlQuery";
import { useQueryApp } from "../../hooks/appolloQueryApp.hook";
import { RouteNames } from "../../router";

const CssRootCard = styled(Card)({
  maxWidth: 450,
  margin: "0 auto",
});

const PageFoundPage: FC = () => {
  const { data } = useQueryApp<IBaseApiUrl>(BASE_API_URL_QUERY);
  const baseApiUrl = data ? data.baseApiUrl : "";

  const bind = {
    name_page: "Страница не найдена",
    action_page:
      "Неправильно набран адрес, или такой страницы на сайте больше не существует.",
    link_page: RouteNames.NO_FOUND_PAGE,
    title: "Страница не найдена",
    filter_on: true,
    meta_key: "Страница не найдена",
  };

  return (
    <PageBase {...bind}>
      <CssRootCard>
        <CardMedia
          component="img"
          alt="Страница не найдена"
          //height="140"
          image={baseApiUrl + "/static/images/404.png"}
        />
        <CardContent>
          <Typography variant="body1" component="p">
            Неправильно набран адрес, или такой страницы на сайте больше не
            существует.
          </Typography>
        </CardContent>
        <CardActions>
          <Button
            size="small"
            color="secondary"
            component={Link}
            to={RouteNames.MAIN_PAGE}
            variant="contained"
          >
            Вернитесь на главную
          </Button>
        </CardActions>
      </CssRootCard>
    </PageBase>
  );
};

export default PageFoundPage;
