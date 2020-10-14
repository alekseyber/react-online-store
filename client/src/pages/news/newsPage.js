import React from "react";
import LoaderPage from "../../components/loaderpage/LoaderPage";
import { useRouter } from "../../hooks/router.hook";
import { PageBase } from "../../hoc/PageBase";
import PageContent from "../../components/pagecontent/PageContent";
import ErrorContent from "../../components/errorcontent/ErrorContent";
import { NEWS_PAGE_QUERY } from "../../graphql/gqlQuery";
import { useQueryApp } from "../../hooks/appolloQueryApp.hook";

export default () => {
  const { params } = useRouter();
  const { alias } = params;

  const { data, loading, error } = useQueryApp(
    NEWS_PAGE_QUERY,
    { alias },
    false,
    true
  );

  if (loading) return <LoaderPage />;
  if (error) return <ErrorContent />;

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
