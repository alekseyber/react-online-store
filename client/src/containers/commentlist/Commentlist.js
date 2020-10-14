import React, { useMemo } from "react";
import PropTypes from "prop-types";
import CommentGrid from "../commentgrid/CommentGrid";
import LoaderContent from "../../components/loadercontent/LoaderContent";
import NullPageContent from "../../components/nullpagecontent/NullPageContent";
import { COMMENT_LIST_QUERY } from "../../graphql/gqlQuery";
import { useQueryApp } from "../../hooks/appolloQueryApp.hook";

const CommentList = ({ page }) => {
  const { data, loading } = useQueryApp(COMMENT_LIST_QUERY);

  const { list, countPage } = useMemo(() => {
    const rezult = {
      list: [],
      countPage: 10,
    };

    if (data) {
      rezult.list = data.comments.list;
      rezult.countPage = data.paramsData.count_page_comment;
    }

    return rezult;
  }, [data]);

  if (loading) {
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

  return <CommentGrid comments={list} page={page} countPage={countPage} />;
};

CommentList.defaultProps = {
  page: 1,
};

CommentList.propTypes = {
  page: PropTypes.number,
};

export default CommentList;
