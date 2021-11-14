import { ElementType, FC, ReactNode } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/material/styles";
import { useHtml } from "../../hooks/html.hook";

const CssRootDiv = styled("div")(({ theme }) => ({
  marginTop: theme.spacing(5),
  marginBottom: theme.spacing(5),
  "& img": {
    maxWidth: "100%",
  },
  "& .pageContent-title": {
    marginBottom: theme.spacing(2),
    fontWeight: 700,
  },
}));

// const useStyles = makeStyles((theme) => ({
//   root: {
//     marginTop: theme.spacing(5),
//     marginBottom: theme.spacing(5),
//     "& img": {
//       maxWidth: "100%",
//     },
//   },
//   title: {
//     marginBottom: theme.spacing(2),
//     fontWeight: 700,
//   },
// }));

interface PageContentProps {
  content: string;
  title?: string;
  tagtitle?: ElementType;
  centertitle?: boolean;
  elevation?: number;
  square?: boolean;
  outlined?: boolean;
}

export const PageContent: FC<PageContentProps> = ({
  content,
  title,
  tagtitle = "h1",
  centertitle = true,
  square = false,
  outlined = false,
  elevation = 2,
}) => {
  const contentReact: ReactNode = useHtml(content);

  if (!content && !title) {
    return null;
  }

  const alignTitle = centertitle ? "center" : "inherit";
  const variant = outlined ? "outlined" : "elevation";

  return (
    <CssRootDiv>
      {title && (
        <Typography
          variant="h6"
          component={tagtitle}
          align={alignTitle}
          className="pageContent-title"
        >
          {title}
        </Typography>
      )}
      <Card square={square} variant={variant} elevation={elevation}>
        <CardContent>{contentReact}</CardContent>
      </Card>
    </CssRootDiv>
  );
};

export default PageContent;
