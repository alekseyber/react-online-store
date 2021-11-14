import { FC } from "react";
import { Link } from "react-router-dom";
import makeStyles from '@mui/styles/makeStyles';
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import LinkUi from "@mui/material/Link";
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

const CartNulled: FC<CartNulledProps> = ({ phone, categoryRootLink }) => {
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

export default CartNulled;
