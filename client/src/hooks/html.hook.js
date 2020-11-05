import React, { useMemo } from "react"; //useEffect, useState
import { Link } from "react-router-dom";
import LinkUi from "@material-ui/core/Link";
import HtmlToReact, { Parser } from "html-to-react"; //HtmlToReact,
import { BASE_API_URL_QUERY } from "../graphql/gqlQuery";
import { useQueryApp } from "./appolloQueryApp.hook";

const isValidNode = () => true;

export const useHtml = (htmlInput) => {
  const { data } = useQueryApp(BASE_API_URL_QUERY);
  const baseApiUrl = data ? data.baseApiUrl : "";

  return useMemo(() => {
    if (!htmlInput) {
      return null;
    }

    const processNodeDefinitions = new HtmlToReact.ProcessNodeDefinitions(
      React
    );

    const processEnd = {
      shouldProcessNode: () => true,
      processNode: processNodeDefinitions.processDefaultNode,
    };

    const processImg = {
      shouldProcessNode: (node) => node && node.name === "img",
      processNode: (node, _, index) => {
        const attrs = {
          key: index,
          src: baseApiUrl + node.attribs.src,
        };
        if (node.attribs.class) {
          attrs.className = node.attribs.class;
        }

        if (node.attribs.alt) {
          attrs.alt = node.attribs.alt;
        }

        return React.createElement("img", attrs);
      },
    };

    const processLink = {
      shouldProcessNode: (node) => node && node.name === "a",
      processNode: (node, children, index) => {
        const props = {
          key: index,
          to: node.attribs.href,
          component: Link,
        };
        let className = "";
        if (node.attribs.class) {
          className = node.attribs.class;
        }

        if (!node.attribs.href) {
          return <span className={className}>{children}</span>;
        }

        if (className) {
          props.className = className;
        }

        return <LinkUi {...props}>{children}</LinkUi>;
      },
    };

    const processingInstructions = [];

    if (baseApiUrl.length) {
      processingInstructions.push(processImg);
    }

    processingInstructions.push(processLink);
    processingInstructions.push(processEnd);

    const htmlToReactParser = new Parser();

    return htmlToReactParser.parseWithInstructions(
      htmlInput,
      isValidNode,
      processingInstructions
    );
  }, [htmlInput, baseApiUrl]);
};

// export const useHtml = (htmlInput) => {
//   const [html, setHtml] = useState(null);

//   const { data } = useQueryApp(BASE_API_URL_QUERY);
//   const baseApiUrl = data ? data.baseApiUrl : "";

//   useEffect(() => {
//     if (htmlInput) {
//       const isValidNode = () => true;

//       const processNodeDefinitions = new HtmlToReact.ProcessNodeDefinitions(React);

//       const processEnd = {
//         shouldProcessNode: () => true,
//         processNode: processNodeDefinitions.processDefaultNode,
//       };

//       const processImg = {
//         shouldProcessNode: (node) => node && node.name === "img",
//         processNode: (node, children, index) => {
//           const attrs = {
//             key: index,
//             src: baseApiUrl + node.attribs.src,
//           };
//           if (node.attribs.class) {
//             attrs.className = node.attribs.class;
//           }

//           if (node.attribs.alt) {
//             attrs.alt = node.attribs.alt;
//           }

//           return React.createElement("img", attrs);
//         },
//       };

//       const processLink = {
//         shouldProcessNode: (node) => node && node.name === "a",
//         processNode: (node, children, index) => {
//           const props = {
//             key: index,
//             to: node.attribs.href,
//             component: Link,
//           };
//           let className = "";
//           if (node.attribs.class) {
//             className = node.attribs.class;
//           }

//           if (!node.attribs.href) {
//             return <span className={className}>{children}</span>;
//           }

//           if (className) {
//             props.className = className;
//           }

//           return <LinkUi {...props}>{children}</LinkUi>;
//         },
//       };

//       const processingInstructions = [];

//       if (baseApiUrl.length) {
//         processingInstructions.push(processImg);
//       }

//       processingInstructions.push(processLink);
//       processingInstructions.push(processEnd);

//       const htmlToReactParser = new Parser();

//       const reactComponent = htmlToReactParser.parseWithInstructions(
//         htmlInput,
//         isValidNode,
//         processingInstructions
//       );

//       // const reactHtml = ReactDOMServer.renderToStaticMarkup(reactComponent);

//       setHtml(reactComponent);
//     }

//     return () => {
//       setHtml(null);
//     };
//   }, [htmlInput, baseApiUrl]);

//   return html;
// };
