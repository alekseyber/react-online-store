import { FC } from "react";
import makeStyles from '@mui/styles/makeStyles';
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { indigo } from "@mui/material/colors";
import Avatar from "@mui/material/Avatar";
import HtmlText from "../htmltext/HtmlText";
import { TComment } from "../../graphql/gqlQuery";

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  indigo: {
    color: theme.palette.getContrastText(indigo[500]),
    backgroundColor: indigo[500],
  },
  title: {
    display: "flex",
    alignItems: "center",
    marginBottom: theme.spacing(1),
  },
  commentText: {
    marginTop: theme.spacing(2),
  },
  commentAnswer: {
    marginTop: theme.spacing(2),
    marginLeft: theme.spacing(3),
  },
}));

interface CommentItemProps {
  item: TComment;
}

const CommentItem: FC<CommentItemProps> = ({ item }) => {
  const classes = useStyles();

  const Contetnt = () => {
    if (!item.htmlstatus) {
      return (
        <Typography component="p" variant="body1">
          {item.commenText}
        </Typography>
      );
    }
    return (
      <Typography component="div" variant="body1">
        <HtmlText text={item.commenText} />
      </Typography>
    );
  };

  return (
    <Grid item xs={12}>
      <Card className={classes.root}>
        <CardContent>
          <div className={classes.title}>
            <Avatar className={classes.indigo}>
              <AccountCircleIcon />
            </Avatar>
            <Typography component="div" variant="h6" className="ml-2">
              {item.authorName}
            </Typography>
          </div>
          <Typography component="p" variant="body2" color="textSecondary">
            {item.date}
          </Typography>
          <div className={classes.commentText}>
            <Contetnt />
          </div>
          {item.answer && (
            <div className={classes.commentAnswer}>
              <Typography component="div" variant="body1" color="textSecondary">
                Ответ магазина:
              </Typography>
              <Typography component="div" variant="body1">
                <HtmlText text={item.answer} />
              </Typography>
            </div>
          )}
        </CardContent>
      </Card>
    </Grid>
  );
};

export default CommentItem;
