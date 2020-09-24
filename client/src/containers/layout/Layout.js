import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AlertApp from '../../components/alertapp/AlertApp';
import Loader from '../../containers/loader/Loader';
import TopBarApp from '../../components/topbar/TopBar';
import AppBarApp from '../../components/appbar/AppBar';
import ModalDialog from '../../containers/modaldialog/ModalDialog';
import AppFooter from '../../components/appfooter/AppFooter';
import BackToTop from '../../components/backtotop/BackToTop';
import { setStart } from '../../redux/actions/start';
import LoaderComponent from '../../components/loader/Loader'
import RouterToTop from '../../components/routettotop/RouterToTop';

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

