import React, { useEffect } from "react";
//import { useQuery } from "@apollo/client";
import { useDispatch, useSelector } from "react-redux";
import AlertApp from "../../components/alertapp/AlertApp";
import Loader from "../../containers/loader/Loader";
import TopBarApp from "../../components/topbar/TopBar";
import AppBarApp from "../../components/appbar/AppBar";
import ModalDialog from "../../containers/modaldialog/ModalDialog";
import AppFooter from "../../components/appfooter/AppFooter";
import BackToTop from "../../components/backtotop/BackToTop";
//import { setStart } from "../../redux/actions/start";
import LoaderComponent from "../../components/loader/Loader";
import RouterToTop from "../../components/routettotop/RouterToTop";
import ErrorContent from "../../components/errorcontent/ErrorContent";
import { setStartApp } from "../../redux/actions/app";
import { LAYOUT_QUERY } from "../../graphql/gqlQuery";
import { useQueryApp } from "../../hooks/appolloQueryApp.hook";

export default ({ children }) => {
  const dispatch = useDispatch();
 // const start = useSelector((state) => state.start.paramsData.select);
  const errorState = useSelector((state) => state.app.error);

  //const { loading, data, error } = useQuery(LAYOUT_QUERY);

  const { loading, data } = useQueryApp(LAYOUT_QUERY, {}, true);

  // console.log("data", data);

  useEffect(() => {
    if (data) {
      const start = {
        city: data.deliveryStart.city,
        sortValue: data.sortData.sortValue,
      };
      dispatch(setStartApp(start));
    }
  }, [dispatch, data]);

  // useEffect(() => {
  //   dispatch(setStart());
  // }, [dispatch]);

  if (errorState) {
    return <ErrorContent />;
  }

  if (loading) {
    return <LoaderComponent />;
  }

  // if (!start) {
  //   return <LoaderComponent />;
  // }

  return (
    <>
      <TopBarApp />
      <AppBarApp />
      <div id="back-to-top-anchor"></div>
      <AlertApp />
      <Loader />
      <ModalDialog />
      {children}
      <AppFooter />
      <BackToTop />
      <RouterToTop />
    </>
  );
};
