import React from 'react';
import PropTypes from 'prop-types';
import Paper from '@material-ui/core/Paper';
import { Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useHtml } from '../../hooks/html.hook';



const useStyles = makeStyles((theme) => ({
    root: {
        marginTop: theme.spacing(5),
        marginBottom: theme.spacing(5),
        '& img': {
            maxWidth: "100%"
        }
    },
    content: {
        padding: theme.spacing(2),
    },
    title: {
        marginBottom: theme.spacing(2),
        fontWeight: 700
    }

}));



export const PageContent = ({ content, title, tagtitle, centertitle, square, outlined, elevation }) => {

    const classes = useStyles();
    const contentReact = useHtml(content);

    if (!content && !title) {
        return null
    }

    const align = centertitle ? 'center' : 'inherit';
    const variant = outlined ? 'outlined' : 'elevation';

    return (
        <div className={classes.root}>
            {title && <Typography variant="h6" component={tagtitle} align={align} className={classes.title}>
                {title}
            </Typography>}
            <Paper
                className={classes.content}
                square={square}
                variant={variant}
                elevation={elevation}
            >{contentReact}</Paper>
        </div>

    )

}



PageContent.defaultProps = {
    tagtitle: "h1",
    centertitle: true,
    elevation: 2,
    square: false,
    outlined: false

};

PageContent.propTypes = {
    content: PropTypes.string,
    title: PropTypes.string,
    tagtitle: PropTypes.string,
    centertitle: PropTypes.bool,
    elevation: PropTypes.number,
    square: PropTypes.bool,
    outlined: PropTypes.bool,

};


export default PageContent;