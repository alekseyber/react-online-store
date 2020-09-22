import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import { useSelector } from 'react-redux';
import LinkUi from '@material-ui/core/Link';
//import ReactDOMServer from 'react-dom/server';
//import config from 'react-global-configuration';
import HtmlToReact, { Parser } from 'html-to-react'; //HtmlToReact, 


// Наш хук
export const useHtml = (htmlInput) => {


  const [html, setHtml] = useState(null);
  const baseUrl = useSelector(state => state.start.baseUrl);
  //const baseUrl = config.get('baseUrl');


  useEffect(
    () => {

      if (htmlInput) {

        const isValidNode = () => true;
        const processNodeDefinitions = new HtmlToReact.ProcessNodeDefinitions(React);
        const processEnd = {
          shouldProcessNode: () => true,
          processNode: processNodeDefinitions.processDefaultNode
        }

        const processImg = {

          shouldProcessNode: (node) => node && node.name === 'img',
          processNode: (node, children, index) => {

            const attrs = {
              key: index,
              src: baseUrl + node.attribs.src,
            }
            if (node.attribs.class) {
              attrs.className = node.attribs.class
            }

            if (node.attribs.alt) {
              attrs.alt = node.attribs.alt
            }

            return React.createElement('img', attrs);

          }
        }

        const processLink = {

          shouldProcessNode: (node) => node && node.name === 'a',
          processNode: (node, children, index) => {

            const props = {
              key: index,
              to: node.attribs.href,
              component: Link
            }
            let className = '';
            if (node.attribs.class) {
              className = node.attribs.class
            }

            if (!node.attribs.href) {
              return <span className={className}>{children}</span>
            }

            if (className) {
              props.className = className;
            }

            return <LinkUi {...props}>{children}</LinkUi>

          }
        }

        const processingInstructions = [];

        if (baseUrl.length) {
          processingInstructions.push(processImg);
        }

        processingInstructions.push(processLink);
        processingInstructions.push(processEnd);


        const htmlToReactParser = new Parser();

        const reactComponent = htmlToReactParser.parseWithInstructions(htmlInput, isValidNode, processingInstructions);

        // const reactHtml = ReactDOMServer.renderToStaticMarkup(reactComponent);

        setHtml(reactComponent)
      }

      return () => {
        setHtml(null)
      };
    },

    // eslint-disable-next-line
    [htmlInput]
  );

  return html;
}