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
  const ListNews: FC = () => {
    const paginationRezult = usePagin();

    return (
      <>
        {paginationRezult.map((item) => (
          <NewsItem
            item={item as TNewsAnnonce}
            key={(item as TNewsAnnonce).alias}
          />
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

export default NewsGrid;
