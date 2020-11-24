import { FC, RefObject } from "react";
import { makeStyles } from "@material-ui/core/styles";
import useScrollTrigger from "@material-ui/core/useScrollTrigger";
import Fab from "@material-ui/core/Fab";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import Zoom from "@material-ui/core/Zoom";

const useStyles = makeStyles((theme) => ({
  root: {
    position: "fixed",
    bottom: theme.spacing(2),
    right: theme.spacing(2),
  },
}));

interface ScrollTopProps {
  anchor: RefObject<HTMLDivElement>;
}

const ScrollTop: FC<ScrollTopProps> = ({ children, anchor }) => {
  // const { children, window } = props;
  const classes = useStyles();

  const trigger = useScrollTrigger({
    //   target: window ? window() : undefined,
    disableHysteresis: true,
    threshold: 100,
  });

  const handleClick = () => {
    //event: React.SyntheticEvent<HTMLElement>

    // const anchor = (event.target.ownerDocument || document).querySelector(
    //   "#back-to-top-anchor"
    // );

    if (anchor.current) {
      anchor.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  };

  return (
    <Zoom in={trigger}>
      <div onClick={handleClick} className={classes.root}>
        {children}
      </div>
    </Zoom>
  );
};

const BackToTop: FC<ScrollTopProps> = (props) => {
  return (
    <ScrollTop {...props}>
      <Fab color="secondary" size="small" aria-label="scroll back to top">
        <KeyboardArrowUpIcon />
      </Fab>
    </ScrollTop>
  );
};

export default BackToTop;
