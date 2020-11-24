import { FC } from "react";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Divider from "@material-ui/core/Divider";
import { makeStyles } from "@material-ui/core/styles";
import { useHtml } from "../../hooks/html.hook";
import { TBannersProduct, IProductContetntData } from "../../graphql/gqlQuery";

const useStyles = makeStyles((theme) => ({
  root: {
    height: "100%",
  },
  prbanner: {
    textAlign: "center",
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
    "& > img": {
      maxWidth: "100%",
      height: "auto",
      marginBottom: theme.spacing(0.5),
    },
  },
}));

interface ProductContetntProps {
  productContetntData: IProductContetntData;
  bannersProduct: TBannersProduct[];
  bannersProductOn: boolean;
  baseApiUrl: string;
}

const ProductContetnt: FC<ProductContetntProps> = ({
  productContetntData,
  bannersProduct,
  bannersProductOn,
  baseApiUrl,
}) => {
  const classes = useStyles();
  const contentReact = useHtml(productContetntData.content);

  return (
    <Card className={classes.root}>
      <CardContent>
        {bannersProductOn && (
          <>
            <Grid container spacing={2}>
              {bannersProduct.map((item, i) => (
                <Grid item xs={6} md={3} key={i} className={classes.prbanner}>
                  <img src={baseApiUrl + item.img} alt={item.title} />
                  <Typography
                    variant="subtitle2"
                    component="div"
                    align="center"
                    className="font-weight-black"
                  >
                    {item.title}
                  </Typography>
                  {item.str1 && (
                    <Typography
                      variant="subtitle2"
                      component="div"
                      color="textSecondary"
                      align="center"
                    >
                      {item.str1}
                    </Typography>
                  )}
                  {item.str2 && (
                    <Typography
                      variant="subtitle2"
                      component="div"
                      color="textSecondary"
                      align="center"
                    >
                      {item.str2}
                    </Typography>
                  )}
                </Grid>
              ))}
            </Grid>
            <Divider className="mb-2" />
          </>
        )}
        <Typography gutterBottom variant="h5" component="h2">
          Детали
        </Typography>
        {contentReact}
        {productContetntData.cartpr1.length > 0 && (
          <ul>
            {productContetntData.cartpr1.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        )}
        {productContetntData.cartpr2.map((item, index) => (
          <p key={index}>{item}</p>
        ))}
      </CardContent>
    </Card>
  );
};

export default ProductContetnt;
