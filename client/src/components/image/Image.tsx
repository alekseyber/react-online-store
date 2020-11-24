import { useState, FC } from "react";
import CircularProgress from "@material-ui/core/CircularProgress";
import common from "@material-ui/core/colors/common";
import grey from "@material-ui/core/colors/grey";
import BrokenImage from "@material-ui/icons/BrokenImage";
import { makeStyles } from "@material-ui/core/styles";

/**
 * Images are ugly until they're loaded. Materialize it with material image! It will fade in like the material image loading pattern suggests.
 * @see [Image loading patterns](https://material.io/guidelines/patterns/loading-images.html)
 */

interface IStyle {
  [key: string]: string | number;
}

interface ImageBaseProps {
  src: string;
  srcSet?: string;
  title?: string;
}

interface ImageProps extends ImageBaseProps {
  animationDuration?: number;
  aspectRatio?: number;
  color?: string;
  disableError?: boolean;
  disableSpinner?: boolean;
  disableTransition?: boolean;
  errorIcon?: React.ReactNode;
  imageStyle?: IStyle;
  iconContainerStyle?: IStyle;
  loading?: React.ReactNode;
  onClick?: (...args: any[]) => any;
  onError?: (...args: any[]) => any;
  onLoad?: (...args: any[]) => any;
  style?: IStyle;
  alt?: string;
  srcset?: string;
}

declare namespace JSX {
  interface ElementAttributesProperty extends ImageBaseProps {}
}

interface IImageTransition {
  opacity: number;
  filterBrightness: number;
  filterSaturate: number;
  transition: string;
}

interface IPropsStyles {
  imageTransition: IImageTransition | {};
  style: IStyle;
  imageStyle: IStyle;
  color: string;
  aspectRatio: number;
  iconContainerStyle: IStyle;
}

const useStyles = makeStyles({
  root: (props: IPropsStyles) => ({
    backgroundColor: props.color,
    paddingTop: `calc(1 / ${props.aspectRatio} * 100%)`,
    position: "relative",
    ...props.style,
  }),
  image: (props: IPropsStyles) => ({
    width: "100%",
    height: "100%",
    position: "absolute",
    top: 0,
    left: 0,
    ...props.imageTransition,
    ...props.imageStyle,
  }),
  iconContainer: (props: IPropsStyles) => ({
    width: "100%",
    height: "100%",
    position: "absolute",
    top: 0,
    left: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    pointerEvents: "none",
    ...props.iconContainerStyle,
  }),
});

const defaultProps = {
  animationDuration: 3000,
  aspectRatio: 1,
  color: common.white,
  disableError: false,
  disableSpinner: false,
  disableTransition: false,
  errorIcon: (
    <BrokenImage style={{ width: 48, height: 48, color: grey[300] }} />
  ),
  loading: <CircularProgress size={48} />,
  alt: "",
  style: {},
  imageStyle: {},
  iconContainerStyle: {},
};

export const Image: FC<ImageProps> = (props) => {
  const [state, setState] = useState({
    imageError: false,
    imageLoaded: false,
  });

  const imageProp: JSX.ElementAttributesProperty = {
    src: props.src,
  };

  if (props.srcset) {
    imageProp.srcSet = props.srcset;
  }

  if (props.title) {
    imageProp.title = props.title;
  }

  const {
    animationDuration = defaultProps.animationDuration,
    aspectRatio = defaultProps.aspectRatio,
    color = defaultProps.color,
    disableError = defaultProps.disableError,
    disableSpinner = defaultProps.disableSpinner,
    disableTransition = defaultProps.disableTransition,
    errorIcon = defaultProps.errorIcon,
    imageStyle = defaultProps.imageStyle,
    style = defaultProps.style,
    loading = defaultProps.loading,
    onClick,
    alt = defaultProps.alt,
    iconContainerStyle = defaultProps.iconContainerStyle,
  } = props;

  const getImageTransition = (): IImageTransition | {} => {
    if (disableTransition) {
      return {};
    }

    const rezult = {
      opacity: state.imageLoaded ? 1 : 0,
      filterBrightness: state.imageLoaded ? 100 : 0,
      filterSaturate: state.imageLoaded ? 100 : 20,
      transition: `
        filterBrightness ${
          animationDuration * 0.75
        }ms cubic-bezier(0.4, 0.0, 0.2, 1),
        filterSaturate ${animationDuration}ms cubic-bezier(0.4, 0.0, 0.2, 1),
        opacity ${animationDuration / 2}ms cubic-bezier(0.4, 0.0, 0.2, 1)`,
    };
    return rezult;
  };

  const imageTransition = getImageTransition();

  const propsStyles: IPropsStyles = {
    imageTransition,
    style,
    imageStyle,
    color,
    aspectRatio,
    iconContainerStyle,
  };

  // const useStyles = makeStyles(() => getStyles());
  const classes = useStyles(propsStyles);

  const handleLoadImage = () => {
    setState((prev) => ({ ...prev, imageLoaded: true }));
    if (props.onLoad) {
      props.onLoad();
    }
  };

  const handleImageError = () => {
    if (props.src) {
      setState((prev) => ({ ...prev, imageError: true }));
      if (props.onError) {
        props.onError();
      }
    }
  };

  return (
    <div className={classes.root} onClick={onClick}>
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
  );
};

// Image.propTypes = {
//   /** Duration of the fading animation, in milliseconds. */
//   animationDuration: PropTypes.number,
//   /** Override aspect ratio. */
//   aspectRatio: PropTypes.number,
//   /** Override the background color. */
//   color: PropTypes.string,
//   /** Disables the error icon if set to true. */
//   disableError: PropTypes.bool,
//   /** Disables the loading spinner if set to true. */
//   disableSpinner: PropTypes.bool,
//   /** Disables the transition after load if set to true. */
//   disableTransition: PropTypes.bool,
//   /** Override the error icon. */
//   errorIcon: PropTypes.node,
//   /** Override the inline-styles of the container that contains the loading spinner and the error icon. */
//   iconContainerStyle: PropTypes.object,
//   /** Override the inline-styles of the image. */
//   imageStyle: PropTypes.object,
//   /** Override the loading component. */
//   loading: PropTypes.node,
//   /** Fired when the user clicks on the image happened. */
//   onClick: PropTypes.func,
//   /** Fired when the image failed to load. */
//   onError: PropTypes.func,
//   /** Fired when the image finished loading. */
//   onLoad: PropTypes.func,
//   /** Specifies the URL of an image. */
//   src: PropTypes.string.isRequired,
//   /** Override the inline-styles of the root element. */
//   style: PropTypes.object,
//   srcset: PropTypes.string,
//   alt: PropTypes.string,
//   title: PropTypes.string,
// };
