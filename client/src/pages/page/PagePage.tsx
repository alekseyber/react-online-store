import { FC } from "react";
import LoaderPage from "../../components/loaderpage/LoaderPage";
import { useParamsMemo } from "../../hooks/router.hook";
import { PageBase } from "../../hoc/PageBase";
import PageContent from "../../components/pagecontent/PageContent";
import ErrorContent from "../../components/errorcontent/ErrorContent";
import {
  PAGE_PAGE_QUERY,
  IPagePage,
  IPagePageVar,
} from "../../graphql/gqlQuery";
import { useQueryApp } from "../../hooks/appolloQueryApp.hook";

const PagePage: FC = () => {
  const { params } = useParamsMemo<{ alias: string }>();
  const { alias } = params;

  const { data, loading, error } = useQueryApp<IPagePage, IPagePageVar>(
    PAGE_PAGE_QUERY,
    { alias },
    false,
    true
  );

  if (loading) return <LoaderPage />;
  if (error) return <ErrorContent />;

  if (!data) {
    return null;
  }

  const pageData = data.page;

  const bind = {
    name_page: pageData.meta_title,
    action_page: pageData.meta_description,
    link_page: "/page/" + alias,
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

export default PagePage;
