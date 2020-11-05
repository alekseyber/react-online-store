import React from "react";
//import PropTypes from "prop-types";
//import { Link } from "react-router-dom";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import CardMedia from "@material-ui/core/CardMedia";
import Button from "@material-ui/core/Button";
import { TMainBanner } from "../../graphql/gqlQuery";
import { useRouter } from "../../hooks/router.hook";
//import { Image } from '../../image/Image';

const CssButton = withStyles({
  root: {
    fontSize: "1vw",
    borderRadius: 0,
    marginTop: "0.4vw",
    padding: "0.4vw 1vw",
    "&:hover": {
      backgroundColor: "#fff",
      color: "red",
    },
  },
})(Button);

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
  },
  media: {
    height: 0,
    paddingTop: "19%", // 1:1
    display: "flex",
  },
  mediain: {
    marginTop: "-19%",
    width: "100%",
    color: "#fff",
    overflow: "hidden",
    alignItems: "center",
    display: "flex",
    justifyContent: "center",
  },
  banwrap: {
    color: "#fff",
    textAlign: "center",
  },
  title: {
    fontWeight: 700,
    fontSize: "2.7vw",
  },
  description: {
    fontSize: "1.9vw",
  },
}));

interface MainBannerProps {
  baseApiUrl: string;
  mainBanner: TMainBanner;
}

export const MainBanner: React.FC<MainBannerProps> = ({
  mainBanner,
  baseApiUrl,
}) => {
  const classes = useStyles();
  const { history } = useRouter();

  if (!mainBanner.visible) {
    return null;
  }

  const handleTo = (event: React.SyntheticEvent, to: string): void => {
    event.preventDefault();
    history.push(to);
  };

  return (
    <div className={classes.root}>
      <CardMedia
        className={classes.media}
        image={baseApiUrl + mainBanner.imgBacgr}
      >
        <div className={classes.mediain}>
          <div className={classes.banwrap}>
            <div className={classes.title}>{mainBanner.title}</div>
            <div className={classes.description}>{mainBanner.description}</div>
            {mainBanner.btnLink.length > 0 && (
              <div className="btnwr">
                <CssButton
                  variant="outlined"
                  color="inherit"
                  href={mainBanner.btnLink}
                  onClick={(e) => handleTo(e, mainBanner.btnLink)}
                >
                  {mainBanner.btnText}
                </CssButton>
              </div>
            )}
          </div>
        </div>
      </CardMedia>
    </div>
  );
};

// MainBanner.propTypes = {
//     mainBanner: PropTypes.object,
//     baseApiUrl: PropTypes.string,
// };

export default MainBanner;
