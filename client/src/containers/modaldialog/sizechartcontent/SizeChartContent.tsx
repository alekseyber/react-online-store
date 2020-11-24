import { FC } from "react";
import ModalBase, { IChildrenNodeBaseProps } from "../../../hoc/ModalBase";
import LoaderContent from "../../../components/loadercontent/LoaderContent";
import {
  ISizeChartContent,
  ISizeChartContentVar,
  SIZE_CHART_CONTENT_QUERY,
} from "../../../graphql/gqlQuery";
import { useQueryApp } from "../../../hooks/appolloQueryApp.hook";
import { useHtml } from "../../../hooks/html.hook";

interface SizeChartContentProps extends IChildrenNodeBaseProps {
  sizesgroupId: string;
}

const SizeChartContent: FC<SizeChartContentProps> = ({
  handleClose,
  sizesgroupId,
}) => {
  const { data, loading } = useQueryApp<
    ISizeChartContent,
    ISizeChartContentVar
  >(SIZE_CHART_CONTENT_QUERY, {
    sizesgroupId,
  });
  const content = data ? data.sizesChart.content : "";
  const contentReact: React.ReactNode = useHtml(content);

  return (
    <ModalBase handleClose={handleClose} title="Размерная сетка">
      {loading === true ? <LoaderContent /> : <>{contentReact}</>}
    </ModalBase>
  );
};

// SizeChartContent.propTypes = {
//   handleClose: PropTypes.func.isRequired,
//   sizesgroupId: PropTypes.string.isRequired,
// };

export default SizeChartContent;
