import React from 'react';
import { useSelector } from 'react-redux';
import Loader from '../../components/loader/Loader';



export default () => {
  const loading = useSelector(state => state.app.loading);


  if (!loading) return null

  return <Loader />
}







