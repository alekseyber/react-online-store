import { useMemo, FC } from "react";
import { PageBase } from "../../hoc/PageBase";
import { useGetQueryPage } from "../../hooks/router.hook";
import ProductListSceleton from "../../components/skeletons/ProductListSceleton";
import PageSceleton from "../../components/skeletons/PageSceleton";
import NullPageContent from "../../components/nullpagecontent/NullPageContent";
import NewsGrid from "../../containers/newsgrid/NewsGrid";
import {
  INDEX_NEWS_PAGE_QUERY,
  IIndexNewsPage,
  TNewsAnnonce,
} from "../../graphql/gqlQuery";
import { useQueryApp } from "../../hooks/appolloQueryApp.hook";

const IndexNewsPage: FC = () => {
  const page = useGetQueryPage();

  const { data, loading, error } = useQueryApp<IIndexNewsPage>(
    INDEX_NEWS_PAGE_QUERY
  );

  const { list, countPage } = useMemo<{
    list: TNewsAnnonce[];
    countPage: number;
  }>(() => {
    const rezult: { list: TNewsAnnonce[]; countPage: number } = {
      list: [],
      countPage: 10,
    };

    if (data) {
      rezult.list = data.newsList.list;
      rezult.countPage = data.paramsData.count_page_news;
    }

    return rezult;
  }, [data]);

  if (loading)
    return (
      <PageSceleton title={true}>
        <ProductListSceleton news={true} />
      </PageSceleton>
    );

  const bind = !error
    ? {
        name_page: "Новости, блог",
        action_page: "Новости, блог",
        link_page: "/Новости, блог",
        title: "Новости, блог",
        filter_on: true,
        page,
        canonical_on: true,
      }
    : { error: true };

  return (
    <PageBase {...bind}>
      {list.length === 0 ? (
        <NullPageContent title="Новостей пока нет." />
      ) : (
        <NewsGrid news={list} page={page} countPage={countPage} />
      )}
    </PageBase>
  );
};

export default IndexNewsPage;
