import { FC } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import DeliveryCityInput from "../../containers/deliverycityinput/DeliveryCityInput";

const useStyles = makeStyles((theme) => ({
  root: {
    marginBottom: theme.spacing(2),
  },
  title: {
    marginBottom: theme.spacing(3),
  },
}));

const DeliveryCity: FC = () => {
  const classes = useStyles();

  return (
    <Card className={classes.root}>
      <CardContent>
        <Typography variant="h6" component="h2">
          Укажите название города
        </Typography>
        <Typography
          variant="body2"
          className={classes.title}
          color="textSecondary"
        >
          для того, чтобы подробнее узнать, о стоимости и сроках доставки
        </Typography>
        <DeliveryCityInput />
      </CardContent>
    </Card>
  );
};

export default DeliveryCity;
