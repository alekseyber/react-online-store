import { FC, memo, useEffect, useCallback, useState } from "react"; //, useCallback
import Carousel from "react-material-ui-carousel";
import CardMedia from "@mui/material/CardMedia";
import { styled } from "@mui/material/styles";
import { Image } from "../image/Image";
import { IProductGalItem } from "../../hooks/useProductDataRender.hook";

interface IStateCarusel {
  caruselIndex: number;
  thumbIndex: number;
}

const initialState: IStateCarusel = {
  caruselIndex: 0,
  thumbIndex: 0,
};

const CssCarousel = styled(Carousel)({
  overflow: "hidden",
  "& .MuiIconButton-root": {
    backgroundColor: "#ccc",
    "&:hover": {
      backgroundColor: "#999",
    },
  },
});

const CssProductThumb = styled("div")(({ theme }) => ({
  display: "flex",
  justifyContent: "center",
  "& .productthumb-imagethumb": {
    "& > img": {
      maxWidth: "40px",
      border: "1px solid #ccc",
      borderRadius: "3px",
      "&:hover": {
        opacity: "0.7",
      },
    },
    margin: theme.spacing(0.4),
    cursor: "pointer",
  },
  "& .productthumb-imagethumb.imagethumb-activ": {
    "& > img": {
      border: "1px solid #000",
    },
  },
}));

interface ProductImgCaruselProps {
  gal: IProductGalItem[];
  title: string;
}

interface ItemThumbProps {
  item: IProductGalItem;
  posistion: number;
}

interface CaruselElProps {
  altText: string;
  gal: IProductGalItem[];
  handleChange: (payload: number) => void;
  indexStart: number;
}

const CaruselEl: FC<CaruselElProps> = memo(function CaruselEl({
  altText,
  gal,
  handleChange,
  indexStart,
}) {
  const ItemSlide: FC<ItemThumbProps> = ({ item, posistion }) => {
    const altTextMain = `${altText} ${posistion + 1} из ${gal.length}`;
    return (
      <CardMedia>
        <Image
          src={item.img}
          srcset={item.srcset}
          title={altTextMain}
          alt={altTextMain}
        />
      </CardMedia>
    );
  };

  return (
    <CssCarousel
      autoPlay={false}      
      indicators={false}
      navButtonsAlwaysVisible={true}
      onChange={(now) => {
        const payload = now || 0;
        handleChange(payload);
      }}
      index={indexStart}
    >
      {gal.map((item, index) => {
        return <ItemSlide item={item} posistion={index} key={index} />;
      })}
    </CssCarousel>
  );
});

const CaruselThumb: FC<CaruselElProps> = ({
  altText,
  gal,
  handleChange,
  indexStart,
}) => {
  const ItemThumb: FC<ItemThumbProps> = ({ item, posistion }) => {
    const className =
      indexStart === posistion
        ? "productthumb-imagethumb imagethumb-activ"
        : "productthumb-imagethumb";

    const altTextThumb = `Thumb ${altText} ${posistion + 1} из ${gal.length}`;
    return (
      <div
        className={className}
        onClick={() => {
          handleChange(posistion);
        }}
      >
        <img alt={altTextThumb} src={item.imgThumb} />
      </div>
    );
  };

  return (
    <CssProductThumb>
      {gal.map((item, index) => {
        return <ItemThumb item={item} posistion={index} key={index} />;
      })}
    </CssProductThumb>
  );
};

const ProductImgCarusel: FC<ProductImgCaruselProps> = ({ gal, title }) => {
  const [state, setState] = useState<IStateCarusel>(initialState);
  const { thumbIndex, caruselIndex } = state;

  const handleChangeThumb = useCallback((payload: number) => {
    setState((prevState) => ({
      ...prevState,
      thumbIndex: payload,
      caruselIndex: payload,
    }));
  }, []);

  const handleChangeCarusel = useCallback((payload: number) => {
    setState((prevState) => ({ ...prevState, thumbIndex: payload }));
  }, []);

  useEffect(() => {
    return setState((prevState) => ({ ...prevState, ...initialState }));
  }, [gal]);

  return (
    <>
      <CaruselEl
        altText={title}
        gal={gal}
        handleChange={handleChangeCarusel}
        indexStart={caruselIndex}
      />
      <CaruselThumb
        altText={title}
        gal={gal}
        handleChange={handleChangeThumb}
        indexStart={thumbIndex}
      />
    </>
  );
};

export default ProductImgCarusel;
