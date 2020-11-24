import { FC } from "react";
import { useHtml } from "../../../hooks/html.hook";

interface DefaultDeliveryTextProps {
  content: string;
}

const DefaultDeliveryText: FC<DefaultDeliveryTextProps> = ({ content }) => {
  const contentReact = useHtml(content);
  if (!contentReact) {
    return null;
  }

  return <>{contentReact}</>;
};
// DefaultDeliveryText.propTypes = {
//   content: PropTypes.string,
// };

export default DefaultDeliveryText;
