import React from "react";
//import PropTypes from 'prop-types';
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardActionArea from "@material-ui/core/CardActionArea";
import LinkUi from "@material-ui/core/Link";
import HtmlText from "../htmltext/HtmlText";
import { useRouter } from "../../hooks/router.hook";
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

const NewsItem: React.FC<NewsItemProps> = ({ item }) => {
  const classes = useStyles();
  const { history } = useRouter();

  const linkItem = "/news/" + item.alias;

  const handleCardClick = () => {
    history.push(linkItem);
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

// NewsItem.propTypes = {
//     item: PropTypes.object.isRequired,
// };

export default NewsItem;
