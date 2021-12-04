import { FC } from "react";
import { PaginationList, usePagin } from "../../hoc/Paginationlist";
import List from "../../components/listapp/List";
import NewsItem from "../../components/newsitem/NewsItem";
import { TNewsAnnonce } from "../../graphql/gqlQuery";

interface NewsGridProps {
  news: TNewsAnnonce[];
  page?: number;
  countPage?: number;
}

const NewsGrid: FC<NewsGridProps> = ({ news, page = 1, countPage = 10 }) => {
  const ListNews: FC = () => {
    const paginationRezult = usePagin();
    return (
      <List
        items={paginationRezult}
        renderItem={(item: TNewsAnnonce) => (
          <NewsItem item={item} key={item.alias} />
        )}
      />
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

export default NewsGrid;
