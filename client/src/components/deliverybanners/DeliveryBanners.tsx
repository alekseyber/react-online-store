import { FC } from "react";
import makeStyles from "@mui/styles/makeStyles";
import Icon from "@mui/material/Icon";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import {
  DELIVERY_BANNERS_QUERY,
  IDeliveryBanners,
} from "../../graphql/gqlQuery";
import { useQueryApp } from "../../hooks/appolloQueryApp.hook";

const useStyles = makeStyles((theme) => ({
  root: {
    marginBottom: theme.spacing(1),
  },
  paper: {
    padding: theme.spacing(2),
    //color: theme.palette.text.secondary,
    height: "100%",
    "& .material-icons": {
      fontSize: "30px",
    },
  },
}));

const DeliveryBanners: FC = () => {
  const classes = useStyles();
  const { data } = useQueryApp<IDeliveryBanners>(DELIVERY_BANNERS_QUERY);

  if (!data) {
    return null;
  }

  const bannersDelivery = data.paramsData.bannersDelivery;

  return (
    <Grid container spacing={2} className={classes.root}>
      {bannersDelivery.map((item, i) => (
        <Grid key={i} item xs={12} sm={6} md={4}>
          <Paper className={classes.paper}>
            <Grid container spacing={1}>
              <Grid item xs={3}>
                <Icon>{item.icons}</Icon>
              </Grid>
              <Grid item xs={9}>
                <Typography
                  variant="subtitle1"
                  component="div"
                  gutterBottom
                  className="font-weight-black"
                >
                  {item.title}
                </Typography>
                {item.str1 && (
                  <Typography
                    variant="subtitle2"
                    component="div"
                    color="textSecondary"
                  >
                    {item.str1}
                  </Typography>
                )}
                {item.str2 && (
                  <Typography
                    variant="subtitle2"
                    component="div"
                    color="textSecondary"
                  >
                    {item.str2}
                  </Typography>
                )}
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      ))}
    </Grid>
  );
};

export default DeliveryBanners;
