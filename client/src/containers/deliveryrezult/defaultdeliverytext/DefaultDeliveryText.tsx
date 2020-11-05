import React from "react";
//import PropTypes from "prop-types";
import { useHtml } from "../../../hooks/html.hook";

interface DefaultDeliveryTextProps {
  content: string;
}

const DefaultDeliveryText: React.FC<DefaultDeliveryTextProps> = ({
  content,
}) => {
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
