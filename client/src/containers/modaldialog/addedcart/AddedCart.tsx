import { FC } from "react";
import Button from "@material-ui/core/Button";
import AddedCartComponent from "../../../components/addedcart/AddedCart";
import ModalBase, { IChildrenNodeBaseProps } from "../../../hoc/ModalBase";
import { useRouter } from "../../../hooks/router.hook";
import { ADDED_CART_MODAL_QUERY, IAddedCart } from "../../../graphql/gqlQuery";
import { useQueryApp } from "../../../hooks/appolloQueryApp.hook";
import LoaderContent from "../../../components/loadercontent/LoaderContent";

const AddedCart: FC<IChildrenNodeBaseProps> = ({ handleClose }) => {
  const { history } = useRouter();

  const { data, loading } = useQueryApp<IAddedCart>(ADDED_CART_MODAL_QUERY);

  const handleOpenOrder = () => {
    history.push("/cart");
    handleClose();
  };
  const lastCart = data ? data.lastCart : null;
  let currSymbol = "";
  if (data) {
    currSymbol = data.paramsData.currSymbol;
  }

  const actionsNode = (
    <>
      <Button onClick={handleClose} variant="outlined" color="primary">
        Продолжить покупки
      </Button>
      <Button onClick={handleOpenOrder} variant="contained" color="primary">
        Оформить заказ
      </Button>
    </>
  );

  return (
    <ModalBase
      handleClose={handleClose}
      title="Добавлено в корзину"
      actionsNode={actionsNode}
    >
      {loading === true || !data ? (
        <LoaderContent />
      ) : (
        <AddedCartComponent lastCart={lastCart} currSymbol={currSymbol} />
      )}
    </ModalBase>
  );
};

// AddedCart.propTypes = {
//   handleClose: PropTypes.func.isRequired,
// };

export default AddedCart;
