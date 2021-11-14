import { FC } from "react";
//import makeStyles from "@mui/styles/makeStyles";
//import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Skeleton from "@mui/material/Skeleton";

// const useStyles = makeStyles({
//   loader: {
//     display: "flex",
//     justifyContent: "center",
//     //  alignItems: "center"
//   },
//   root: {
//     minHeight: "20vh",
//   },
// });

interface LoaderContentProps {
  text?: string;
}

const LoaderContent: FC<LoaderContentProps> = ({ text = "Загрузка..." }) => {
  return (
    <Card elevation={0}>
      <CardContent>
        {text && (
          <Typography variant="h6" component="h2" align="center" gutterBottom>
            {text}
          </Typography>
        )}
        {new Array(5).fill(1).map((_, index) => (
          <Typography key={index} component="div">
            <Skeleton />
          </Typography>
        ))}
      </CardContent>
    </Card>
  );
};

export default LoaderContent;

//<CircularProgress size={30} thickness={5} />
