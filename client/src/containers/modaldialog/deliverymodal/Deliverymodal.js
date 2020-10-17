import React from "react";
import PropTypes from "prop-types";
import ModalBase from "../../../hoc/ModalBase";
import Delivery from "../../delivery/Delivery";

const DeliveryModal = ({ handleClose }) => {
  return (
    <ModalBase handleClose={handleClose} title="О доставке и оплате">
      <Delivery />
    </ModalBase>
  );
};

DeliveryModal.propTypes = {
  handleClose: PropTypes.func.isRequired,
};

export default DeliveryModal;
