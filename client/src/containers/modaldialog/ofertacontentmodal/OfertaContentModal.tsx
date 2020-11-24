import { FC } from "react";
import ModalBase, { IChildrenNodeBaseProps } from "../../../hoc/ModalBase";
import { useHtml } from "../../../hooks/html.hook";
import LoaderContent from "../../../components/loadercontent/LoaderContent";
import {
  IOfertaContentModal,
  OFERTA_CONTENT_MODAL_QUERY,
} from "../../../graphql/gqlQuery";
import { useQueryApp } from "../../../hooks/appolloQueryApp.hook";

const OfertaContentModal: FC<IChildrenNodeBaseProps> = ({ handleClose }) => {
  const { data, loading } = useQueryApp<IOfertaContentModal>(
    OFERTA_CONTENT_MODAL_QUERY
  );
  const ofertaContent = data ? data.oferta.content : "";
  const contentReact: React.ReactNode = useHtml(ofertaContent);

  return (
    <ModalBase handleClose={handleClose} title="Публичная оферта">
      {loading === true ? <LoaderContent /> : <>{contentReact}</>}
    </ModalBase>
  );
};

// OfertaContentModal.propTypes = {
//   handleClose: PropTypes.func.isRequired,
// };

export default OfertaContentModal;
