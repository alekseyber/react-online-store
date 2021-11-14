import { FC } from "react";
import makeStyles from '@mui/styles/makeStyles';
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
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
