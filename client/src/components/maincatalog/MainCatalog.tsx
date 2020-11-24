import { FC, SyntheticEvent } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import CardMedia from "@material-ui/core/CardMedia";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import Link from "@material-ui/core/Link";
import { TMaincatalog } from "../../graphql/gqlQuery";
import { useRouter } from "../../hooks/router.hook";

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  card: {
    "&:hover": {
      boxShadow:
        "0 5px 5px -3px rgba(0,0,0,.2), 0 8px 10px 1px rgba(0,0,0,.14), 0 3px 14px 2px rgba(0,0,0,.12)",
      "& $mediain": {
        transform: "scaleY(1)",
      },
    },
    transition: "box-shadow .4s cubic-bezier(.25,.8,.25,1)",
    transitionProperty: "box-shadow",
    transitionDuration: "0.4s",
    transitionTimingFunction: "cubic-bezier(0.25, 0.8, 0.25, 1)",
    transitionDelay: "0s",
    textDecoration: "none",
    display: "block",
  },
  media: {
    height: 0,
    paddingTop: "100%", // 1:1
    display: "flex",
  },
  mediain: {
    marginTop: "-100%",
    backgroundColor: "rgba(0,0,0,.2)",
    width: "100%",
    color: theme.palette.primary.contrastText,
    overflow: "hidden",
    alignItems: "center",
    display: "flex",
    justifyContent: "center",
    transform: "scaleY(0)",
    transformOrigin: "bottom",
    transition: "transform 0.26s ease",
  },
  title: {
    fontWeight: 700,
  },
}));

interface MainCatalogProps {
  maincatalog: TMaincatalog[];
  maincatalogprefix: string;
  maincatalogcount: number;
  categoryImgBase: string;
}

const MainCatalog: FC<MainCatalogProps> = ({
  maincatalog,
  maincatalogprefix,
  maincatalogcount,
  categoryImgBase,
}) => {
  const classes = useStyles();
  const { history } = useRouter();

  const handleTo = (to: string): void => {
    history.push("/category/" + to);
  };

  const preventDefault = (event: SyntheticEvent) => {
    event.preventDefault();
  };

  const sm = maincatalogcount === 3 ? 4 : 6;
  const md = maincatalogcount === 3 ? 4 : 3;

  return (
    <Grid container spacing={3} className={classes.root}>
      {maincatalog.map((item, index) => (
        <Grid item xs={12} sm={sm} md={md} key={index}>
          <Card className={classes.card} onClick={() => handleTo(item.alias)}>
            <CardActionArea>
              <CardMedia
                className={classes.media}
                image={categoryImgBase + item.img}
                //  title={item.title}
              >
                <div className={classes.mediain}>
                  <Link
                    variant="h5"
                    href={"/category/" + item.alias}
                    color="inherit"
                    onClick={preventDefault}
                  >
                    Открыть {item.title}
                  </Link>
                </div>
              </CardMedia>
              <CardContent>
                {maincatalogprefix && (
                  <Typography
                    variant="h5"
                    component="div"
                    color="textSecondary"
                  >
                    {maincatalogprefix}
                  </Typography>
                )}
                <Typography
                  variant="h5"
                  component="div"
                  color="secondary"
                  className={classes.title}
                >
                  {item.title}
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default MainCatalog;
