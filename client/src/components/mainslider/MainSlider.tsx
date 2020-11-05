import React from "react";
//import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import withWidth, { isWidthUp, WithWidth } from "@material-ui/core/withWidth";
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Divider from "@material-ui/core/Divider";
import Typography from "@material-ui/core/Typography";
import { Image } from "../image/Image";
import { TTopSlider } from "../../graphql/gqlQuery";

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: theme.spacing(1),
  },
  img: {
    backgroundPosition: "center center",
    backgroundSize: "cover",
  },
  fw: {
    fontWeight: 700,
  },
  imgLogo: {
    maxWidth: "100px",
    margin: "0 auto",
  },
  card: {
    maxWidth: "400px",
    margin: "0 auto",
    //  backgroundColor: "rgba(255,255,255,0.3)",
    backgroundColor: "transparent",
    border: "none",
  },
  topBlock: {
    marginBottom: theme.spacing(2),
  },
  bottomBlock: {
    marginTop: theme.spacing(2),
  },
}));

interface MainSliderFProps extends WithWidth {
  topSlider: TTopSlider;
  baseApiUrl: string;
}

const MainSliderF: React.FC<MainSliderFProps> = ({
  topSlider,
  baseApiUrl,
  width,
}) => {
  const classes = useStyles();

  const imgStyle = {
    backgroundImage: `url(${baseApiUrl + topSlider.imgBackground})`,
    height: topSlider.maxHeightBackground,
  };

  return (
    <div className={classes.root}>
      <Grid
        container
        alignItems="center"
        className={classes.img}
        style={imgStyle}
      >
        {isWidthUp("sm", width) && <Grid item md={7} lg={7}></Grid>}
        <Grid item xs={12} md={5} lg={4}>
          <Card className={classes.card} variant="outlined">
            <CardContent>
              <div className={classes.imgLogo}>
                <Image
                  src={baseApiUrl + topSlider.imgLogo}
                  //   aspectRatio={(1)}
                  disableSpinner
                  color="transparent"
                  alt={topSlider.altLogo}
                />
              </div>
              <div className={classes.topBlock}>
                <Typography variant="h4" component="div" align="center">
                  {topSlider.topString1}
                </Typography>
                <Typography variant="h4" component="div" align="center">
                  {topSlider.topString2}
                </Typography>
                {topSlider.topString3 && (
                  <Typography variant="h4" component="div" align="center">
                    {topSlider.topString3}
                  </Typography>
                )}
                {topSlider.topString4 && (
                  <Typography variant="h6" component="div" align="center">
                    {topSlider.topString4}
                  </Typography>
                )}
              </div>
              <Divider />
              <div className={classes.bottomBlock}>
                <Typography
                  variant="h6"
                  component="div"
                  align="center"
                  color="secondary"
                >
                  {topSlider.bottomString1}
                </Typography>
                <Typography
                  variant="h5"
                  component="div"
                  className={classes.fw}
                  align="center"
                  color="secondary"
                >
                  {topSlider.bottomString2}
                </Typography>
                {topSlider.bottomString3.length > 0 && (
                  <Typography variant="h6" component="div" align="center">
                    {topSlider.bottomString3}
                  </Typography>
                )}
                {topSlider.bottomString4.length > 0 && (
                  <Typography variant="h6" component="div" align="center">
                    {topSlider.bottomString4}
                  </Typography>
                )}
              </div>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
};

// MainSliderF.propTypes = {
//   topSlider: PropTypes.object.isRequired,
//   baseApiUrl: PropTypes.string,
//   width: PropTypes.string,
// };

export default withWidth()(MainSliderF);
