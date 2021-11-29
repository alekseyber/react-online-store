import { FC } from "react";
//import LoaderPage from "../../components/loaderpage/LoaderPage";
import PageSceleton from "../../components/skeletons/PageSceleton";
import ContentSceleton from "../../components/skeletons/ContentSceleton";
import { useAliasParams } from "../../hooks/use-alias-params.hook";
import { PageBase } from "../../hoc/PageBase";
import PageContent from "../../components/pagecontent/PageContent";
import ErrorContent from "../../components/errorcontent/ErrorContent";
import {
  NEWS_PAGE_QUERY,
  INewsPage,
  INewsPageVar,
} from "../../graphql/gqlQuery";
import { useQueryApp } from "../../hooks/appolloQueryApp.hook";
import { RouteNames, getLinkByRoutePath } from "../../router";

const NewsPage: FC = () => {
  const alias = useAliasParams();

  const { data, loading, error } = useQueryApp<INewsPage, INewsPageVar>(
    NEWS_PAGE_QUERY,
    { alias },
    false,
    true
  );

  if (loading)
    return (
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
    link_page: getLinkByRoutePath("NEWS_PAGE", alias),
    title: pageData.title,
    filter_on: true,
    meta_full: true,
    meta_key: pageData.meta_keywords,
    breadcrumbs_name: pageData.title,
    breadcrumbs_data: [
      {
        text: data.paramsData.newsSectionName,
        disabled: false,
        href: RouteNames.INDEX_NEWS_PAGE,
        level: 2,
      },
    ],
  };

  return (
    <PageBase {...bind}>
      <PageContent content={pageData.content} />
    </PageBase>
  );
};

export default NewsPage;
