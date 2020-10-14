import React from "react";
import PropTypes from "prop-types";
import { PaginationList, usePagin } from "../../hoc/Paginationlist";
import NewsItem from "../../components/newsitem/NewsItem";

const NewsGrid = ({ news, page, countPage }) => {
  const ListNews = () => {
    const paginationRezult = usePagin();

    return (
      <>
        {paginationRezult.map((item, index) => (
          <NewsItem item={item} key={index} />
        ))}
      </>
    );
  };

  const paginBind = {
    countPage,
    page,
    inputList: news,
    spacingGrid: 3,
  };

  return (
    <PaginationList {...paginBind}>
      <ListNews />
    </PaginationList>
  );
};

NewsGrid.defaultProps = {
  news: [],
  page: 1,
  countPage: 10,
};

NewsGrid.propTypes = {
  news: PropTypes.array,
  page: PropTypes.number,
  countPage: PropTypes.number,
};

export default NewsGrid;
