import { FC } from "react";
import { PaginationList, usePagin } from "../../hoc/Paginationlist";
import CommentItem from "../../components/commentitem/CommentItem";
import List from "../../components/listapp/List";
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
      <List
        items={paginationRezult}
        renderItem={(item: TComment) => (
          <CommentItem item={item} key={item._id} />
        )}
      />
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

export default CommentGrid;
