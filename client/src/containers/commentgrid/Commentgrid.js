import React from "react";
import PropTypes from "prop-types";
import { PaginationList, usePagin } from "../../hoc/Paginationlist";
import CommentItem from "../../components/commentitem/CommentItem";

const CommentGrid = ({ comments, page, countPage }) => {
  const ListComment = () => {
    const paginationRezult = usePagin();

    return (
      <>
        {paginationRezult.map((item, index) => (
          <CommentItem item={item} key={index} />
        ))}
      </>
    );
  };

  const paginBind = {
    countPage,
    page,
    inputList: comments,
    spacingGrid: 2,
  };

  return (
    <PaginationList {...paginBind}>
      <ListComment />
    </PaginationList>
  );
};

CommentGrid.defaultProps = {
  comments: [],
  page: 1,
  countPage: 10,
};

CommentGrid.propTypes = {
  comments: PropTypes.array,
  page: PropTypes.number,
  countPage: PropTypes.number,
};

export default CommentGrid;
