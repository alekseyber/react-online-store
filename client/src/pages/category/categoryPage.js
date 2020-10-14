import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { categoryFetch } from "../../redux/actions/category";
import { setFilterSelectByQwery } from "../../redux/actions/filter";
import LoaderPage from "../../components/loaderpage/LoaderPage";
import Category from "../../containers/category/Category";
import { useQuery, useRouter } from "../../hooks/router.hook";
import { CATEGORY_PAGE_QUERY } from "../../graphql/gqlQuery";
import { useQueryApp } from "../../hooks/appolloQueryApp.hook";

export default () => {
  const { params } = useRouter();
  const { alias } = params;
  const query = useQuery(true);

  const { data, loading } = useQueryApp(CATEGORY_PAGE_QUERY, {}, false, true);

  const categoryData = useSelector((state) => state.category[alias]);

  //   const sortValueApp = useSelector(state => state.start.sortData.sortValue);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(categoryFetch(alias));
  }, [dispatch, alias]);

  useEffect(() => {
    if (data) {
      dispatch(setFilterSelectByQwery(query, data.filterIndex));
    }
  }, [dispatch, data, query]);

  if (!categoryData || loading) return <LoaderPage />;

  if (!data) {
    return null;
  }

  const { filterData } = data;

  return (
    <Category
      categoryData={categoryData}
      alias={alias}
      filterData={filterData}
    />
  );
};
