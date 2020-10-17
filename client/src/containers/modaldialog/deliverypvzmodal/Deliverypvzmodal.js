import React from "react";
import PropTypes from "prop-types";
import ModalBase from "../../../hoc/ModalBase";
import DeliveryPvzSelectror from "../../deliveryrepvzselector/DeliveryPvzSelector";

const DeliveryPvzModal = ({ handleClose }) => {
  return (
    <ModalBase handleClose={handleClose} title="Выбор ПВЗ">
      <DeliveryPvzSelectror />
    </ModalBase>
  );
};

DeliveryPvzModal.propTypes = {
  handleClose: PropTypes.func.isRequired,
};

export default DeliveryPvzModal;
