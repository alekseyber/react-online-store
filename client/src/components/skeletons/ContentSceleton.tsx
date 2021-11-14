import { FC } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/material/styles";
import Skeleton from "@mui/material/Skeleton";

const CssRootCard = styled(Card)(({ theme }) => ({
  marginTop: theme.spacing(5),
  marginBottom: theme.spacing(5),
}));

export interface IContentSceletonProps {
  countString?: number;
  elevation?: number;
  square?: boolean;
  outlined?: boolean;
}

const ContentSceleton: FC<IContentSceletonProps> = ({
  countString = 15,
  square = false,
  outlined = false,
  elevation = 2,
}) => {
  const variant = outlined ? "outlined" : "elevation";
  return (
    <CssRootCard square={square} variant={variant} elevation={elevation}>
      <CardContent>
        <Typography variant="h3">
          <Skeleton width={100} />
        </Typography>
        <Skeleton />
        {new Array(countString).fill(1).map((_, index) => (
          <Typography key={index} component="div">
            <Skeleton />
          </Typography>
        ))}
      </CardContent>
    </CssRootCard>
  );
};

export default ContentSceleton;
