import { FC } from "react";
import { PaginationList, usePagin } from "../../hoc/Paginationlist";
import NewsItem from "../../components/newsitem/NewsItem";
import { TNewsAnnonce } from "../../graphql/gqlQuery";

interface NewsGridProps {
  news: TNewsAnnonce[];
  page?: number;
  countPage?: number;
}

const spacingGrid: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 = 3;

const NewsGrid: FC<NewsGridProps> = ({ news, page = 1, countPage = 10 }) => {
  const ListNews: React.FC = () => {
    const paginationRezult = usePagin();

    return (
      <>
        {paginationRezult.map((item, index) => (
          <NewsItem item={item as TNewsAnnonce} key={index} />
        ))}
      </>
    );
  };

  const paginBind = {
    countPage,
    page,
    inputList: news,
    spacingGrid,
  };

  return (
    <PaginationList {...paginBind}>
      <ListNews />
    </PaginationList>
  );
};

// NewsGrid.defaultProps = {
//   news: [],
//   page: 1,
//   countPage: 10,
// };

// NewsGrid.propTypes = {
//   news: PropTypes.array,
//   page: PropTypes.number,
//   countPage: PropTypes.number,
// };

export default NewsGrid;
