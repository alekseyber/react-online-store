import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Button from "@material-ui/core/Button";
import { ERROR_QUERY } from "../../graphql/gqlQuery";
import { useQueryApp } from "../../hooks/appolloQueryApp.hook";

const useStyles = makeStyles({
  root: {
    height: "100vh",
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  card: {
    maxWidth: 400,
    "& img": {
      maxWidth: "200px",
      margin: "15px auto",
    },
  },
  btn: {
    textAlign: "center",
    marginTop: "15px",
  },
});

const ErrorContent = () => {
  const classes = useStyles();
  
  const { data } = useQueryApp(ERROR_QUERY);
  const error = data ? data.error : null;
  
  const title = error ? error.title : "Ой, что-то пошло не так...";
  const text = error ? error.text : "Проверьте интернет и попробуйте еще раз";

  const onClickHandler = () => {    
    if (error.func) {
      error.func();
    }
  };

  return (
    <div className={classes.root}>
      <Card className={classes.card}>
        <CardMedia
          component="img"
          alt="Что-то пошло не так"
          image="/ne-tak.png"
        />
        <CardContent>
          <Typography variant="h6" component="h2" align="center" gutterBottom>
            {title}
          </Typography>
          <Typography variant="body2" component="p" align="center">
            {text}
          </Typography>
          {error !== null && (
            <div className={classes.btn}>
              <Button
                color="secondary"
                variant="contained"
                onClick={onClickHandler}
              >
                Повторить
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ErrorContent;
