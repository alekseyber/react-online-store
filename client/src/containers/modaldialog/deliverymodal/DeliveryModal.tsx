import { FC } from "react";
import ModalBase, { IChildrenNodeBaseProps } from "../../../hoc/ModalBase";
import Delivery from "../../delivery/Delivery";

const DeliveryModal: FC<IChildrenNodeBaseProps> = ({ handleClose }) => {
  return (
    <ModalBase handleClose={handleClose} title="О доставке и оплате">
      <Delivery />
    </ModalBase>
  );
};

// DeliveryModal.propTypes = {
//   handleClose: PropTypes.func.isRequired,
// };

export default DeliveryModal;
