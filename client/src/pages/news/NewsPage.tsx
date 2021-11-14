import { FC } from "react";
//import LoaderPage from "../../components/loaderpage/LoaderPage";
import PageSceleton from "../../components/skeletons/PageSceleton";
import ContentSceleton from "../../components/skeletons/ContentSceleton";
import { useParamsMemo } from "../../hooks/router.hook";
import { PageBase } from "../../hoc/PageBase";
import PageContent from "../../components/pagecontent/PageContent";
import ErrorContent from "../../components/errorcontent/ErrorContent";
import {
  NEWS_PAGE_QUERY,
  INewsPage,
  INewsPageVar,
} from "../../graphql/gqlQuery";
import { useQueryApp } from "../../hooks/appolloQueryApp.hook";

const NewsPage: FC = () => {
  const { params } = useParamsMemo<{ alias: string }>();
  const { alias } = params;

  const { data, loading, error } = useQueryApp<INewsPage, INewsPageVar>(
    NEWS_PAGE_QUERY,
    { alias },
    false,
    true
  );

  if (loading) return (
    <PageSceleton title={true}>
      <ContentSceleton />
    </PageSceleton>
  );
  if (error) return <ErrorContent />;

  if (!data) {
    return null;
  }

  const pageData = data.news;

  const bind = {
    name_page: pageData.meta_title,
    action_page: pageData.meta_description,
    link_page: "/news/" + alias,
    title: pageData.title,
    filter_on: true,
    meta_full: true,
    meta_key: pageData.meta_keywords,
    breadcrumbs_name: pageData.title,
  };

  return (
    <PageBase {...bind}>
      <PageContent content={pageData.content} />
    </PageBase>
  );
};

export default NewsPage;
