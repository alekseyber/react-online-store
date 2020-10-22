import React from "react";
import PropTypes from "prop-types";
import AppForm from "../../../components/appform/AppForm";
import ModalBase from "../../../hoc/ModalBase";
import LoaderPage from "../../../components/loaderpage/LoaderPage";
import { useAddOrder } from "../../../hooks/addOrder.hook";

const QOrder = ({ handleClose }) => {
  const { loadingData, handleSubmit } = useAddOrder(true);

  return (
    <ModalBase
      handleClose={handleClose}
      title="Быстрый заказ"
      actionsBtnText="Продолжить покупки"
    >
      {loadingData ? (
        <LoaderPage />
      ) : (
        <AppForm handleInputSubmit={handleSubmit} fullOrder={false} />
      )}
    </ModalBase>
  );
};

QOrder.propTypes = {
  handleClose: PropTypes.func.isRequired,
};

export default QOrder;
