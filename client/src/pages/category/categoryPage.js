import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setFilterSelectByQwery } from "../../redux/actions/filter";
import LoaderPage from "../../components/loaderpage/LoaderPage";
import Category from "../../containers/category/Category";
import { useQuery, useRouter } from "../../hooks/router.hook";
import { CATEGORY_PAGE_QUERY } from "../../graphql/gqlQuery";
import { useQueryApp } from "../../hooks/appolloQueryApp.hook";
import ErrorContent from "../../components/errorcontent/ErrorContent";

export default () => {
  const { params } = useRouter();
  const { alias } = params;
  const query = useQuery(true);

  const dispatch = useDispatch();
  const { data, loading, error } = useQueryApp(
    CATEGORY_PAGE_QUERY,
    { alias },
    false,
    true,
    "cache-first"
  );

  const filterIndex = data ? data.filterIndex : null;

  useEffect(() => {
    if (filterIndex) {
      dispatch(setFilterSelectByQwery(query, filterIndex));
    }
  }, [dispatch, filterIndex, query]);

  if (loading) return <LoaderPage />;
  if (error) return <ErrorContent />;

  return <Category data={data} alias={alias} />;
};
