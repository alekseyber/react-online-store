import React from 'react';
import PropTypes from 'prop-types';
import { useHtml } from '../../hooks/html.hook';



const Html = ({ text }) => {
    const contentReact = useHtml(text);

    return <>{contentReact}</>

}

Html.propTypes = {
    text: PropTypes.string.isRequired,
};


export default Html;