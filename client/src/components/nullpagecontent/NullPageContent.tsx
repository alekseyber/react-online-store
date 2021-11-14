import { FC } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import makeStyles from '@mui/styles/makeStyles';

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
