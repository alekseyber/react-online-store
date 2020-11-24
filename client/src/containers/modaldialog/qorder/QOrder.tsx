import { FC } from "react";
import AppForm from "../../../components/appform/AppForm";
import ModalBase, { IChildrenNodeBaseProps } from "../../../hoc/ModalBase";
import LoaderPage from "../../../components/loaderpage/LoaderPage";
import { useAddOrder } from "../../../hooks/addOrder.hook";

const QOrder: FC<IChildrenNodeBaseProps> = ({ handleClose }) => {
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

// QOrder.propTypes = {
//   handleClose: PropTypes.func.isRequired,
// };

export default QOrder;
