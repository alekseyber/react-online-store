import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AlertApp from '../../components/alertapp/Alertapp';
import Loader from '../../containers/loader/Loader';
import TopBarApp from '../../components/topbar/Topbar';
import AppBarApp from '../../components/appbar/Appbar';
import ModalDialog from '../../containers/modaldialog/Modaldialog';
import AppFooter from '../../components/appfooter/Appfooter';
import BackToTop from '../../components/backtotop/Backtotop';
import { setStart } from '../../redux/actions/start';
import LoaderComponent from '../../components/loader/Loader'
import RouterToTop from '../../components/routettotop/Routertotop';

export default ({ children }) => {
  const dispatch = useDispatch();
  const start = useSelector(state => state.start.paramsData.select);


  useEffect(() => {
    dispatch(setStart());

  }, [dispatch]);

  if (!start) {
    return <LoaderComponent />
    //  return null
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

  )

}

