import React from "react";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import ModalBase from "../../../hoc/ModalBase";
import LoaderContent from "../../../components/loadercontent/LoaderContent";
import { SIZE_CHART_CONTENT_QUERY } from "../../../graphql/gqlQuery";
import { useQueryApp } from "../../../hooks/appolloQueryApp.hook";
import { useHtml } from "../../../hooks/html.hook";

const SizeChartContent = ({ handleClose }) => {
  const sizesgroupId = useSelector(
    (state) => state.modaldialog.sizechartSelect
  );
  const { data, loading } = useQueryApp(SIZE_CHART_CONTENT_QUERY, {
    sizesgroupId,
  });
  const content = data ? data.sizesChart.content : "";
  const contentReact = useHtml(content);

  return (
    <ModalBase handleClose={handleClose} title="Размерная сетка">
      {loading === true ? <LoaderContent /> : <>{contentReact}</>}
    </ModalBase>
  );
};

SizeChartContent.propTypes = {
  handleClose: PropTypes.func.isRequired,
};

export default SizeChartContent;
