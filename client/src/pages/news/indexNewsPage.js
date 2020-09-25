import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { PageBase } from "../../hoc/PageBase";
import { useGetQueryPage } from "../../hooks/router.hook";
import { newsListFetch } from "../../redux/actions/page";
import LoaderPage from "../../components/loaderpage/LoaderPage";
import NullPageContent from "../../components/nullpagecontent/NullPageContent";
import NewsGrid from "../../containers/newsgrid/NewsGrid";

export default () => {
  const page = useGetQueryPage();
  const { endTime, list } = useSelector((state) => state.page.newsList);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(newsListFetch());
  }, [dispatch]);

  if (!endTime) return <LoaderPage />;

  const bind = {
    name_page: "Новости, блог",
    action_page: "Новости, блог",
    link_page: "/Новости, блог",
    title: "Новости, блог",
    filter_on: true,
    page,
    canonical_on: true,
  };

  return (
    <PageBase {...bind}>
      {list.length === 0 ? (
        <NullPageContent title="Новостей пока нет." />
      ) : (
        <NewsGrid news={list} page={page} />
      )}
    </PageBase>
  );
};
