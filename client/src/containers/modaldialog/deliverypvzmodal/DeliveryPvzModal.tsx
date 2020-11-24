import { FC } from "react";
import ModalBase, { IChildrenNodeBaseProps } from "../../../hoc/ModalBase";
import DeliveryPvzSelectror from "../../deliveryrepvzselector/DeliveryPvzSelector";

const DeliveryPvzModal: FC<IChildrenNodeBaseProps> = ({ handleClose }) => {
  return (
    <ModalBase handleClose={handleClose} title="Выбор ПВЗ">
      <DeliveryPvzSelectror />
    </ModalBase>
  );
};

// DeliveryPvzModal.propTypes = {
//   handleClose: PropTypes.func.isRequired,
// };

export default DeliveryPvzModal;
