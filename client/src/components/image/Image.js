import React, { useState } from 'react';
import PropTypes from 'prop-types';
import CircularProgress from '@material-ui/core/CircularProgress';
import common from '@material-ui/core/colors/common';
import grey from '@material-ui/core/colors/grey';
import BrokenImage from '@material-ui/icons/BrokenImage';
import { makeStyles } from '@material-ui/core/styles';


/**
 * Images are ugly until they're loaded. Materialize it with material image! It will fade in like the material image loading pattern suggests.
 * @see [Image loading patterns](https://material.io/guidelines/patterns/loading-images.html)
 */




export const Image = (props) => {

    const [state, setState] = useState({
        imageError: false,
        imageLoaded: false,
    });


    const imageProp = {
        src: props.src
    }

    if (props.srcset) {
        imageProp.srcSet = props.srcset;
    }

    const {
        animationDuration,
        aspectRatio,
        color,
        disableError,
        disableSpinner,
        disableTransition,
        errorIcon,
        imageStyle,
        style,
        loading,
        onClick,
        alt,
        iconContainerStyle,
        //  ...image
    } = props;




    const getStyles = () => {
        const imageTransition = !disableTransition && {
            opacity: state.imageLoaded ? 1 : 0,
            filterBrightness: state.imageLoaded ? 100 : 0,
            filterSaturate: state.imageLoaded ? 100 : 20,
            transition: `
        filterBrightness ${animationDuration * 0.75}ms cubic-bezier(0.4, 0.0, 0.2, 1),
        filterSaturate ${animationDuration}ms cubic-bezier(0.4, 0.0, 0.2, 1),
        opacity ${animationDuration / 2}ms cubic-bezier(0.4, 0.0, 0.2, 1)`
        }

        const styles = {
            root: {
                backgroundColor: color,
                paddingTop: `calc(1 / ${aspectRatio} * 100%)`,
                position: 'relative',
                ...style
            },
            image: {
                width: '100%',
                height: '100%',
                position: 'absolute',
                top: 0,
                left: 0,
                ...imageTransition,
                ...imageStyle
            },
            iconContainer: {
                width: '100%',
                height: '100%',
                position: 'absolute',
                top: 0,
                left: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                pointerEvents: 'none',
                ...iconContainerStyle
            }
        }

        return styles
    }

    const useStyles = makeStyles(() => (getStyles()))
    const classes = useStyles();

    const handleLoadImage = () => {
        setState({ imageLoaded: true })
        if (props.onLoad) {
            props.onLoad()
        }
    }

    const handleImageError = () => {
        if (props.src) {
            setState({ imageError: true })
            if (props.onError) {
                props.onError()
            }
        }
    }

    return (
        <div
            className={classes.root}
            onClick={onClick}
        >
            <img
                {...imageProp}
                className={classes.image}
                onLoad={handleLoadImage}
                onError={handleImageError}
                alt={alt}
            />
            <div className={classes.iconContainer}>
                {!disableSpinner && !state.imageLoaded && !state.imageError && loading}
                {!disableError && state.imageError && errorIcon}
            </div>
        </div>
    )
}


Image.defaultProps = {
    animationDuration: 3000,
    aspectRatio: 1,
    color: common.white,
    disableError: false,
    disableSpinner: false,
    disableTransition: false,
    errorIcon: <BrokenImage style={{ width: 48, height: 48, color: grey[300] }} />,
    loading: <CircularProgress size={48} />,
    alt: ''
}

Image.propTypes = {
    /** Duration of the fading animation, in milliseconds. */
    animationDuration: PropTypes.number,
    /** Override aspect ratio. */
    aspectRatio: PropTypes.number,
    /** Override the background color. */
    color: PropTypes.string,
    /** Disables the error icon if set to true. */
    disableError: PropTypes.bool,
    /** Disables the loading spinner if set to true. */
    disableSpinner: PropTypes.bool,
    /** Disables the transition after load if set to true. */
    disableTransition: PropTypes.bool,
    /** Override the error icon. */
    errorIcon: PropTypes.node,
    /** Override the inline-styles of the container that contains the loading spinner and the error icon. */
    iconContainerStyle: PropTypes.object,
    /** Override the inline-styles of the image. */
    imageStyle: PropTypes.object,
    /** Override the loading component. */
    loading: PropTypes.node,
    /** Fired when the user clicks on the image happened. */
    onClick: PropTypes.func,
    /** Fired when the image failed to load. */
    onError: PropTypes.func,
    /** Fired when the image finished loading. */
    onLoad: PropTypes.func,
    /** Specifies the URL of an image. */
    src: PropTypes.string.isRequired,
    /** Override the inline-styles of the root element. */
    style: PropTypes.object,
    srcset: PropTypes.string,
    alt: PropTypes.string,

}