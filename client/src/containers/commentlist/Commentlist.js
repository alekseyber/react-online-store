import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import CommentGrid from "../commentgrid/CommentGrid";
import LoaderContent from "../../components/loadercontent/LoaderContent";
import { commentListFetch } from "../../redux/actions/page";
import NullPageContent from "../../components/nullpagecontent/NullPageContent";

const CommentList = ({ page }) => {
  const dispatch = useDispatch();
  const { endTime, list } = useSelector((state) => state.page.commentList);

  useEffect(() => {
    dispatch(commentListFetch());
  }, [dispatch]);

  if (!endTime) {
    return <LoaderContent />;
  }

  if (list.length === 0) {
    return (
      <NullPageContent
        title="Отзывов пока нет."
        str="Отправьте отзыв, использую форму выше."
      />
    );
  }

  return <CommentGrid comments={list} page={page} />;
};

CommentList.defaultProps = {
  page: 1,
};

CommentList.propTypes = {
  page: PropTypes.number,
};

export default CommentList;
