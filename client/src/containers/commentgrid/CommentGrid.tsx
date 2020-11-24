import { FC } from "react";
import { PaginationList, usePagin } from "../../hoc/Paginationlist";
import CommentItem from "../../components/commentitem/CommentItem";
import { TComment } from "../../graphql/gqlQuery";

interface CommentGridProps {
  comments: TComment[];
  page?: number;
  countPage?: number;
}

const CommentGrid: FC<CommentGridProps> = ({
  comments,
  page = 1,
  countPage = 10,
}) => {
  const ListComment = () => {
    const paginationRezult = usePagin();

    return (
      <>
        {paginationRezult.map((item, index) => (
          <CommentItem item={item as TComment} key={index} />
        ))}
      </>
    );
  };

  const paginBind = {
    countPage,
    page,
    inputList: comments,
  };

  return (
    <PaginationList {...paginBind}>
      <ListComment />
    </PaginationList>
  );
};

// CommentGrid.defaultProps = {
//   comments: [],
//   page: 1,
//   countPage: 10,
// };

// CommentGrid.propTypes = {
//   comments: PropTypes.array,
//   page: PropTypes.number,
//   countPage: PropTypes.number,
// };

export default CommentGrid;
