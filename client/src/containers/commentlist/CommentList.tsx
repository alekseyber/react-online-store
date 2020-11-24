import { FC } from "react";
import CommentGrid from "../commentgrid/CommentGrid";
import LoaderContent from "../../components/loadercontent/LoaderContent";
import NullPageContent from "../../components/nullpagecontent/NullPageContent";
import { COMMENT_LIST_QUERY, IComment } from "../../graphql/gqlQuery";
import { useQueryApp } from "../../hooks/appolloQueryApp.hook";

interface CommentListProps {
  page?: number;
}

const CommentList: FC<CommentListProps> = ({ page = 1 }) => {
  const { data, loading } = useQueryApp<IComment>(COMMENT_LIST_QUERY);

  if (loading) {
    return <LoaderContent />;
  }

  if (!data) {
    return null;
  }

  const list = data.comments.list;
  const countPage = data.paramsData.count_page_comment;

  if (list.length === 0) {
    return (
      <NullPageContent
        title="Отзывов пока нет."
        str="Отправьте отзыв, использую форму выше."
      />
    );
  }

  return <CommentGrid comments={list} page={page} countPage={countPage} />;
};

// CommentList.defaultProps = {
//   page: 1,
// };

// CommentList.propTypes = {
//   page: PropTypes.number,
// };

export default CommentList;
