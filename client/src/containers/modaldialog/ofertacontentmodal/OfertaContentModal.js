import React from "react";
import PropTypes from "prop-types";
import ModalBase from "../../../hoc/ModalBase";
import { useHtml } from "../../../hooks/html.hook";
import LoaderContent from "../../../components/loadercontent/LoaderContent";
import { OFERTA_CONTENT_MODAL_QUERY } from "../../../graphql/gqlQuery";
import { useQueryApp } from "../../../hooks/appolloQueryApp.hook";

const OfertaContentModal = ({ handleClose }) => {
  const { data, loading } = useQueryApp(OFERTA_CONTENT_MODAL_QUERY);
  const ofertaContent = data ? data.oferta.content : "";
  const contentReact = useHtml(ofertaContent);

  return (
    <ModalBase handleClose={handleClose} title="Публичная оферта">
      {loading === true ? <LoaderContent /> : <>{contentReact}</>}
    </ModalBase>
  );
};

OfertaContentModal.propTypes = {
  handleClose: PropTypes.func.isRequired,
};

export default OfertaContentModal;
