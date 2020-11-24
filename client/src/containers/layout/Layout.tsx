import { createRef, FC } from "react";
import AlertApp from "../../components/alertapp/AlertApp";
import TopBarApp from "../../components/topbar/TopBar";
import AppBarApp from "../../components/appbar/AppBar";
import ModalDialog from "../../containers/modaldialog/ModalDialog";
import AppFooter from "../../components/appfooter/AppFooter";
import BackToTop from "../../components/backtotop/BackToTop";
import LoaderComponent from "../../components/loader/Loader";
import RouterToTop from "../../components/routettotop/RouterToTop";
import ErrorContent from "../../components/errorcontent/ErrorContent";
import { LAYOUT_QUERY, ILayout } from "../../graphql/gqlQuery";
import { useQueryApp } from "../../hooks/appolloQueryApp.hook";
import { sortValueVar, cityСurrentVar } from "../../graphql/localVars";

const Layout: FC = ({ children }) => {
  const refDiv = createRef<HTMLDivElement>();
  const onCompleted = ({ sortData, deliveryStart }: ILayout) => {
    if (sortData) {
      sortValueVar(sortData.sortValue);
    }
    if (deliveryStart) {
      cityСurrentVar(deliveryStart.city);
    }
  };

  const { loading, error } = useQueryApp<ILayout>(
    LAYOUT_QUERY,
    null,
    true,
    false,
    null,
    onCompleted
  );

  if (error) {
    return <ErrorContent />;
  }

  if (loading) {
    return <LoaderComponent />;
  }

  return (
    <>
      <TopBarApp />
      <AppBarApp />
      <div ref={refDiv}></div>
      <AlertApp />
      <ModalDialog />
      {children}
      <AppFooter />
      <BackToTop anchor={refDiv} />
      <RouterToTop />
    </>
  );
};

export default Layout;
