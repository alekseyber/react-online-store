import { FC, useMemo, SyntheticEvent } from "react";
import { Link } from "react-router-dom";
import { Theme, useTheme, styled } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import Carousel from "react-material-ui-carousel";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { getTintedColor } from "../../hooks/colorUtil.hook";
import { useRouter } from "../../hooks/router.hook";
import { TTopSlider } from "../../graphql/gqlQuery";

const CssCarousel = styled(Carousel)(({ theme }) => ({
  marginTop: theme.spacing(2),
  marginBottom: theme.spacing(2),
  "& .mainSlider-media": {
    height: 0,
    paddingTop: "100%", // 1:1
    position: "relative",
    transition: ".3s",
    "&:hover": {
      filter: "brightness(115%)",
      "& .MuiButton-root": {
        backgroundColor: "rgba(0,0,0,.8)",
      },
    },
  },
}));

interface MainSliderFProps {
  topSlider: TTopSlider[];
  baseApiUrl: string;
  topSliderAutoPlay: boolean;
  topSliderInterval: number;
}

interface ItemMainSlidProps {
  itemSlider: TTopSlider;
  baseApiUrl: string;
  isWidthUpMd: boolean;
  index: number;
}

class MainBoxData {
  readonly fontColor: string;
  readonly backgroundColor: string;
  readonly title: string;
  readonly description: string;
  readonly linkHref: string;
  readonly linkAncor: string;

  public constructor(itemSlider: TTopSlider) {
    this.fontColor = itemSlider.mainFontColor || "fffff";
    this.backgroundColor = itemSlider.mainBackgroundColor || "771818";
    this.title = itemSlider.mainTitle;
    this.description = itemSlider.mainDescription;
    this.linkHref = itemSlider.mainLinkHref;
    this.linkAncor = itemSlider.mainLinkAncor;
  }
}

class SecondaryBoxData {
  readonly img: string;
  readonly linkHref: string;
  readonly linkAncor: string;

  public constructor(itemSlider: TTopSlider, first?: boolean) {
    this.img = first ? itemSlider.secondImg1 : itemSlider.secondImg2;
    this.linkAncor = first
      ? itemSlider.secondLinkAncor1
      : itemSlider.secondLinkAncor2;
    this.linkHref = first
      ? itemSlider.secondLinkHref1
      : itemSlider.secondLinkHref2;
  }
}

type TItemBox = MainBoxData | SecondaryBoxData;
type TBoxes = TItemBox[];

function getMainPosition(index: number): number {
  let mainPosition = 0;
  mainPosition = (index + 1) % 2 === 0 ? 1 : mainPosition;
  mainPosition = (index + 1) % 3 === 0 ? 2 : mainPosition;
  return mainPosition;
}

interface MainBoxProps {
  item: MainBoxData;
}
interface SecondaryBoxProps {
  item: SecondaryBoxData;
  baseApiUrl: string;
}
const MainBox: FC<MainBoxProps> = ({ item }) => {
  const btnIsVisible = Boolean(item.linkAncor && item.linkHref);
  const backgroundColorDark = getTintedColor(item.backgroundColor, 20);
  const btnHoverSxProps = {
    border: `3px solid #${item.fontColor}`,
    color: `#${item.backgroundColor}`,
    backgroundColor: `#${item.fontColor}`,
  };

  return (
    <Box
      sx={{
        p: 4,
        height: "100%",
        backgroundColor: `#${item.backgroundColor}`,
        color: `#${item.fontColor}`,
        transition: ".3s",
        "&:hover": {
          backgroundColor: backgroundColorDark,
          "& .MuiButton-root": btnHoverSxProps,
        },
      }}
    >
      <Typography variant="h5" gutterBottom={true}>
        {item.title}
      </Typography>
      <Typography variant="subtitle1">{item.description}</Typography>
      {btnIsVisible && (
        <Button
          variant="outlined"
          size="large"
          component={Link}
          to={item.linkHref}
          sx={{
            mt: 5,
            color: `#${item.fontColor}`,
            border: `3px solid #${item.fontColor}`,
            "&:hover": btnHoverSxProps,
          }}
        >
          <Typography component="span" variant="subtitle1">
            {item.linkAncor}
          </Typography>
        </Button>
      )}
    </Box>
  );
};

const SecondaryBox: FC<SecondaryBoxProps> = ({ item, baseApiUrl }) => {
  const { history } = useRouter();
  const btnIsVisible = Boolean(item.linkAncor && item.linkHref);

  const handleBoxClick = () => {
    if (item.linkHref) {
      history.push(item.linkHref);
    }
  };

  return (
    <CardMedia
      onClick={handleBoxClick}
      className="mainSlider-media"
      image={baseApiUrl + item.img}
    >
      {btnIsVisible && (
        <Button
          component={Link}
          to={item.linkHref}
          variant="outlined"
          onClick={(event: SyntheticEvent) => event.stopPropagation()}
          sx={{
            backgroundColor: "rgba(0,0,0,.6)",
            height: "15%",
            width: "100%",
            color: "#fff",
            border: "none",            
            transition: "0.3s",
            position: "absolute",
            bottom: 0,
            textTransform: "none",
            justifyContent: "flex-start",
            "&:hover": {              
              backgroundColor: "rgba(0,0,0,.8)",
              color: "#fff",
              border: "none",
            },
          }}
        >
          <Typography component="div" variant="subtitle1">
            {item.linkAncor}
          </Typography>
        </Button>
      )}
    </CardMedia>
  );
};

const ItemMainSlide: FC<ItemMainSlidProps> = ({
  itemSlider,
  baseApiUrl,
  isWidthUpMd,
  index,
}) => {
  const spacingRoot = isWidthUpMd ? 0 : 1;

  const boxes = useMemo<TBoxes>(() => {
    const rezult: TBoxes = [];

    const mainPosition = isWidthUpMd ? getMainPosition(index) : 0;

    let first = true;

    for (let i = 0; i < 3; i++) {
      if (i === mainPosition) {
        rezult.push(new MainBoxData(itemSlider));
        continue;
      }
      rezult.push(new SecondaryBoxData(itemSlider, first));
      first = false;
    }

    return rezult;
  }, [itemSlider, index, isWidthUpMd]);

  return (
    <Card elevation={7}>
      <Grid container spacing={spacingRoot}>
        {boxes.map((item, i) => (
          <Grid
            item
            xs={12}
            sm={item instanceof MainBoxData ? 12 : 6}
            md={4}
            key={i}
          >
            {item instanceof MainBoxData ? (
              <MainBox item={item} />
            ) : (
              <SecondaryBox item={item} baseApiUrl={baseApiUrl} />
            )}
          </Grid>
        ))}
      </Grid>
    </Card>
  );
};

const MainSlider: FC<MainSliderFProps> = ({
  topSlider,
  baseApiUrl,
  topSliderAutoPlay,
  topSliderInterval,
}) => {
  const theme: Theme = useTheme();
  const isWidthUpMd = useMediaQuery(theme.breakpoints.up("md"));
  const isLength = topSlider.length > 1;

  return (
    <CssCarousel
      autoPlay={isLength && topSliderAutoPlay}
      interval={topSliderInterval || 4000}
      // indicators={isLength}
      navButtonsAlwaysVisible={false}
      navButtonsAlwaysInvisible={!isLength}
    >
      {topSlider.map((item, index) => {
        return (
          <ItemMainSlide
            itemSlider={item}
            isWidthUpMd={isWidthUpMd}
            index={index}
            baseApiUrl={baseApiUrl}
            key={index}
          />
        );
      })}
    </CssCarousel>
  );
};

export default MainSlider;
