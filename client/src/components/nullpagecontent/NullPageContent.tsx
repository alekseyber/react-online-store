import { FC } from "react";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
  root: {
    minHeight: "20vh",
  },
});

interface NullPageContentProps {
  title?: string;
  str?: string;
}

const NullPageContent: FC<NullPageContentProps> = ({ title, str }) => {
  const classes = useStyles();
  return (
    <Card className={classes.root}>
      <CardContent>
        {title && (
          <Typography variant="h6" component="h2" align="center" gutterBottom>
            {title}
          </Typography>
        )}
        {str && (
          <Typography variant="body1" component="p" align="center">
            {str}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

export default NullPageContent;
