import { FC } from "react";
import { styled } from "@mui/material/styles";
import { PageBase } from "../../hoc/PageBase";
import CommentAdd from "../../components/commentadd/CommentAdd";
import CommentList from "../../containers/commentlist/CommentList";
import { RouteNames } from "../../router";
import { useGetQueryPage } from "../../hooks/router.hook";

const CssRootDiv = styled("div")({
  maxWidth: 750,
  margin: "0 auto",
});

const CommentPage: FC = () => {
  const page = useGetQueryPage();

  const bind = {
    name_page: "Отзывы",
    action_page: "Отзывы",
    link_page: RouteNames.COMMENT_PAGE,
    title: "Отзывы",
    filter_on: true,
    page,
    canonical_on: true,
  };

  return (
    <PageBase {...bind}>
      <CssRootDiv>
        <CommentAdd />
        <CommentList page={page} />
      </CssRootDiv>
    </PageBase>
  );
};

export default CommentPage;
