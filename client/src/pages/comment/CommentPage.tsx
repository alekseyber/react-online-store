import { FC } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { PageBase } from "../../hoc/PageBase";
import CommentAdd from "../../components/commentadd/CommentAdd";
import CommentList from "../../containers/commentlist/CommentList";
import { useGetQueryPage } from "../../hooks/router.hook";

const useStyles = makeStyles({
  root: {
    maxWidth: 750,
    margin: "0 auto",
  },
});

const CommentPage: FC = () => {
  const classes = useStyles();
  const page = useGetQueryPage();

  const bind = {
    name_page: "Отзывы",
    action_page: "Отзывы",
    link_page: "/comment",
    title: "Отзывы",
    filter_on: true,
    page,
    canonical_on: true,
  };

  return (
    <PageBase {...bind}>
      <div className={classes.root}>
        <CommentAdd />
        <CommentList page={page} />
      </div>
    </PageBase>
  );
};

export default CommentPage;
