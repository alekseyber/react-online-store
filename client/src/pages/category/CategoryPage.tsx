import React, { useEffect } from "react";
import { setFilterSelectByQwery } from "../../graphql/localVarsFilter";
import LoaderPage from "../../components/loaderpage/LoaderPage";
import Category from "../../containers/category/Category";
import { useQuery, useParamsMemo, TStringifiableRecordArrayParams } from "../../hooks/router.hook";
import {
  CATEGORY_PAGE_QUERY,
  ICategoryPageVar,
  ICategoryPage,
} from "../../graphql/gqlQuery";
import { useQueryApp } from "../../hooks/appolloQueryApp.hook";
import ErrorContent from "../../components/errorcontent/ErrorContent";

const CategoryPage: React.FC = () => {
  const { params } = useParamsMemo<{ alias: string }>();
  const { alias } = params;
  const query = useQuery(true) as TStringifiableRecordArrayParams;

  const { data, loading, error } = useQueryApp<ICategoryPage, ICategoryPageVar>(
    CATEGORY_PAGE_QUERY,
    { alias },
    false,
    true,
    "cache-first"
  );

  const filterIndex = data ? data.filterData.filterIndex : null;

  useEffect(() => {
    if (filterIndex) {
      setFilterSelectByQwery(query, filterIndex);
    }
  }, [filterIndex, query]);

  if (loading) return <LoaderPage />;
  if (error) return <ErrorContent />;

  if (!data) {
    return null;
  }

  return <Category data={data} alias={alias} />;
};

export default CategoryPage;
