import { FC } from "react";
import { useNavigate } from "react-router-dom";
import makeStyles from '@mui/styles/makeStyles';
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardActionArea from "@mui/material/CardActionArea";
import LinkUi from "@mui/material/Link";
import HtmlText from "../htmltext/HtmlText";
import { TNewsAnnonce } from "../../graphql/gqlQuery";

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
    height: "100%",
    "&:hover": {
      boxShadow:
        "0 5px 5px -3px rgba(0,0,0,.2), 0 8px 10px 1px rgba(0,0,0,.14), 0 3px 14px 2px rgba(0,0,0,.12)",
    },
    transition: "box-shadow .4s cubic-bezier(.25,.8,.25,1)",
    transitionProperty: "box-shadow",
    transitionDuration: "0.4s",
    transitionTimingFunction: "cubic-bezier(0.25, 0.8, 0.25, 1)",
    transitionDelay: "0s",
    textDecoration: "none",
    cursor: "pointer",
    "& img": {
      maxWidth: "100%",
      height: "auto",
    },
  },
  title: {
    fontWeight: 700,
  },
}));

interface NewsItemProps {
  item: TNewsAnnonce;
}

const NewsItem: FC<NewsItemProps> = ({ item }) => {
  const classes = useStyles();
  let navigate = useNavigate();

  const linkItem = "/news/" + item.alias;

  const handleCardClick = () => {
    navigate(linkItem);
  };

  return (
    <Grid item xs={12} md={6}>
      <Card className={classes.root}>
        <CardActionArea onClick={handleCardClick}>
          <CardContent>
            <LinkUi
              variant="subtitle1"
              gutterBottom
              className={classes.title}
              href={linkItem}
              onClick={(e: React.SyntheticEvent) => () => e.preventDefault()}
            >
              {item.title}
            </LinkUi>
            <Typography component="div" variant="body2">
              <HtmlText text={item.annonce} />
            </Typography>
          </CardContent>
        </CardActionArea>
      </Card>
    </Grid>
  );
};


export default NewsItem;
