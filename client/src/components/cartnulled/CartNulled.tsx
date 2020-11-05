import React from "react";
//import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import LinkUi from "@material-ui/core/Link";
import { TPhone } from "../../graphql/gqlQuery";

const useStyles = makeStyles((theme) => ({
  root: {
    marginBottom: theme.spacing(3),
    maxWidth: 500,
    marginLeft: "auto",
    marginRight: "auto",
  },
  title: {
    marginBottom: theme.spacing(2),
  },
}));

interface CartNulledProps {
  phone: TPhone;
  categoryRootLink: string;
}

const CartNulled: React.FC<CartNulledProps> = ({ phone, categoryRootLink }) => {
  const classes = useStyles();

  return (
    <Card className={classes.root}>
      <CardContent>
        <Typography variant="h6" component="h1" className={classes.title}>
          Ваша корзина пока пуста
        </Typography>
        <Typography component="p">
          Оформить заказ вы можете следующими способами:
        </Typography>
        <ol>
          <Typography component="li">
            Перейти в каталог и выбрать товар
          </Typography>
          <li>
            <Typography component="span" className="mr-1">
              Позвонить по номеру:
            </Typography>
            <LinkUi className="font-weight-black" href={"tel:" + phone.href}>
              {phone.title}
            </LinkUi>
          </li>
        </ol>
      </CardContent>
      <CardActions>
        <Button component={Link} to={categoryRootLink}>
          Продолжить покупки
        </Button>
      </CardActions>
    </Card>
  );
};

// CartNulled.propTypes = {
//   phone: PropTypes.object.isRequired,
//   categoryRootLink: PropTypes.string.isRequired,
// };

export default CartNulled;
