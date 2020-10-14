import React, { useMemo } from "react";
import { PageBase } from "../../hoc/PageBase";
import { useGetQueryPage } from "../../hooks/router.hook";
import LoaderPage from "../../components/loaderpage/LoaderPage";
import NullPageContent from "../../components/nullpagecontent/NullPageContent";
import NewsGrid from "../../containers/newsgrid/NewsGrid";
import { INDEX_NEWS_PAGE_QUERY } from "../../graphql/gqlQuery";
import { useQueryApp } from "../../hooks/appolloQueryApp.hook";

export default () => {
  const page = useGetQueryPage();

  const { data, loading, error } = useQueryApp(INDEX_NEWS_PAGE_QUERY);
  
  const { list, countPage } = useMemo(() => {
    const rezult = {
      list: [],
      countPage: 10,
    };

    if (data) {
      rezult.list = data.newsList.list;
      rezult.countPage = data.paramsData.count_page_news;
    }

    return rezult;
  }, [data]);

  if (loading) return <LoaderPage />;

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
