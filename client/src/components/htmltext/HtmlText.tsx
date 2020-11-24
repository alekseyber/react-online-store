import { FC } from "react";
import { useHtml } from "../../hooks/html.hook";

interface HtmlTextProps {
  text: string;
}

const HtmlText: FC<HtmlTextProps> = ({ text }) => {
  const contentReact = useHtml(text);

  return <>{contentReact}</>;
};

export default HtmlText;
