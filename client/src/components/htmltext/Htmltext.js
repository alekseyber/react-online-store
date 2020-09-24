import React from 'react';
import PropTypes from 'prop-types';
import { useHtml } from '../../hooks/html.hook';



const HtmlText = ({ text }) => {
    const contentReact = useHtml(text);

    return <>{contentReact}</>

}

HtmlText.propTypes = {
    text: PropTypes.string.isRequired,
};


export default HtmlText;