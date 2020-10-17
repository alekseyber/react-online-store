import React from "react";
import { useSelector } from "react-redux";
import AlertApp from "../../components/alertapp/AlertApp";
import Loader from "../../containers/loader/Loader";
import TopBarApp from "../../components/topbar/TopBar";
import AppBarApp from "../../components/appbar/AppBar";
import ModalDialog from "../../containers/modaldialog/ModalDialog";
import AppFooter from "../../components/appfooter/AppFooter";
import BackToTop from "../../components/backtotop/BackToTop";
import LoaderComponent from "../../components/loader/Loader";
import RouterToTop from "../../components/routettotop/RouterToTop";
import ErrorContent from "../../components/errorcontent/ErrorContent";
import { LAYOUT_QUERY } from "../../graphql/gqlQuery";
import { useQueryApp } from "../../hooks/appolloQueryApp.hook";
import { sortValueVar, cityСurrentVar } from "../../graphql/localVars";

export default ({ children }) => {
  const errorState = useSelector((state) => state.app.error);

  const onCompleted = (dataRezult) => {
    if (dataRezult.sortData) {
      sortValueVar(dataRezult.sortData.sortValue);
    }
    if (dataRezult.deliveryStart) {
      cityСurrentVar(dataRezult.deliveryStart.city);
    }
  };

  const { loading } = useQueryApp(
    LAYOUT_QUERY,
    {},
    true,
    false,
    null,
    onCompleted
  );

  if (errorState) {
    return <ErrorContent />;
  }

  if (loading) {
    return <LoaderComponent />;
  }

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
