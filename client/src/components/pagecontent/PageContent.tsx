import { ElementType, FC } from "react";
import Paper from "@material-ui/core/Paper";
import { Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { useHtml } from "../../hooks/html.hook";

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: theme.spacing(5),
    marginBottom: theme.spacing(5),
    "& img": {
      maxWidth: "100%",
    },
  },
  content: {
    padding: theme.spacing(2),
  },
  title: {
    marginBottom: theme.spacing(2),
    fontWeight: 700,
  },
}));

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
  const classes = useStyles();
  const contentReact: React.ReactNode = useHtml(content);

  if (!content && !title) {
    return null;
  }

  const align = centertitle ? "center" : "inherit";
  const variant = outlined ? "outlined" : "elevation";

  return (
    <div className={classes.root}>
      {title && (
        <Typography
          variant="h6"
          component={tagtitle}
          align={align}
          className={classes.title}
        >
          {title}
        </Typography>
      )}
      <Paper
        className={classes.content}
        square={square}
        variant={variant}
        elevation={elevation}
      >
        {contentReact}
      </Paper>
    </div>
  );
};

export default PageContent;
