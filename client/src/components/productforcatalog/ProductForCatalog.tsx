import { FC, SyntheticEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { styled } from "@mui/material/styles";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import LinkUi from "@mui/material/Link";
import DoneIcon from "@mui/icons-material/Done";
import { Image } from "../image/Image";
import { setColorProductAction } from "../../graphql/localVarsCart";
import { IProductRezult } from "../../hooks/useProductDataRender.hook";
import { TProductLevel1 } from "../../graphql/gqlQuery";

const CssRootCard = styled(Card)(({ theme }) => ({
  "&:hover": {
    boxShadow:
      "0 5px 5px -3px rgba(0,0,0,.2), 0 8px 10px 1px rgba(0,0,0,.14), 0 3px 14px 2px rgba(0,0,0,.12)",
  },
  transition: "box-shadow .4s cubic-bezier(.25,.8,.25,1)",
  transitionProperty: "box-shadow",
  transitionDuration: "0.4s",
  transitionTimingFunction: "cubic-bezier(0.25, 0.8, 0.25, 1)",
  transitionDelay: "0s",
  textDecoration: "none",
  cursor: "pointer",
  "& .productCatalog-header": {
    position: "relative",
    "& > div": {
      position: "absolute",
      zIndex: 10,
      top: theme.spacing(1),
    },
  },
  "& .productCatalog-badgewrap": {
    width: "36%",
    left: theme.spacing(1),
  },
  "& .productCatalog-badge": {
    padding: "2px 6px",
    color: "#fff",
  },
  "& .productCatalog-colorwrap": {
    width: "52%",
    right: theme.spacing(1),
    display: "flex",
    justifyContent: "flex-end",
    flexWrap: "wrap",
  },
  "& .productCatalog-title": {
    fontWeight: 700,
    minHeight: "3.5rem",
  },
  "& .productCatalog-price": {
    fontWeight: 700,
    color: theme.palette.priceprimary.main,
  },
  "& .productCatalog-oldprice": {
    fontWeight: 700,
    marginLeft: theme.spacing(1),
    textDecoration: "line-through",
    color: theme.palette.priceprimary.light,
  },
  "& .productCatalog-color": {
    // "&:hover": {
    //   textDecoration: "none",
    // },
    margin: "3px",
  },
  "& .productCatalog-colorav": {
    width: "16px",
    height: "16px",
    color: "#fff",
    display: "flex",
    overflow: "hidden",
    position: "relative",
    alignItems: "center",
    flexShrink: 0,
    borderRadius: "50%",
    justifyContent: "center",
    "& .MuiSvgIcon-root": {
      fontSize: "0.75rem",
    },
  },
}));

interface ProductForCatalogProps {
  product: IProductRezult;
  currsymbol: string;
}

interface ColorItemProps {
  item: TProductLevel1;
}

const ProductForCatalog: FC<ProductForCatalogProps> = ({
  product,
  currsymbol,
}) => {
  let navigate = useNavigate();

  const handleCardClick = () => {
    if (product.current.alias !== product.stateSelectColor) {
      setColorProductAction(
        product.alias,
        product.current.alias,
        product.current.level2
      );
    }
    navigate(product.link);
  };

  //event: ChangeEvent<HTMLInputElement>
  const preventDefault = (event: SyntheticEvent) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const handleColorHover = (color: string, event: SyntheticEvent) => {
    preventDefault(event);
    event.stopPropagation();
    setColorProductAction(product.alias, color, product.current.level2);
  };

  const badge = product.current.bagdeItem ? (
    <div
      className="productCatalog-badge"
      style={{ backgroundColor: `#${product.current.bagdeItem.colorkey}` }}
    >
      {product.current.bagdeItem.title}
    </div>
  ) : null;

  const Colorlevel: FC = () => {
    if (product.product_model > 2) return null;

    const ColorItem: FC<ColorItemProps> = ({ item }) => {
      const href =
        product.color_default !== item.alias
          ? `${product.link}?colors=${item.alias}`
          : product.link;

      return (
        <LinkUi
          href={href}
          color="inherit"
          underline="none"
          className="productCatalog-color"
          onClick={(e: SyntheticEvent) => handleColorHover(item.alias, e)}
          //  onMouseEnter={(e: SyntheticEvent) => handleColorHover(item.alias, e)}
        >
          <div
            className="productCatalog-colorav"
            style={{ backgroundColor: "#" + item.colorItem.colorkey }}
          >
            {item.alias === product.current.alias && <DoneIcon />}
          </div>
        </LinkUi>
      );
    };

    return (
      <>
        {product.level1Arr.map((item) => (
          <ColorItem key={item.alias} item={item} />
        ))}
      </>
    );
  };

  return (
    <CssRootCard onClick={handleCardClick}>
      <div className="productCatalog-header">
        <div className="productCatalog-badgewrap">{badge}</div>
        <div className="productCatalog-colorwrap">
          <Colorlevel />
        </div>
      </div>
      <CardMedia>
        <Image
          src={product.imgThumb}
          srcset={product.srcset}
          title={product.title}
          alt={product.title}
          disableSpinner
        />
      </CardMedia>
      <CardContent>
        <LinkUi
          component={Link}
          to={product.link}
          color="inherit"
          variant="inherit"
          underline="hover"
        >
          <Typography variant="subtitle2" color="textSecondary" component="div">
            {product.gender}
          </Typography>
          <Typography
            variant="subtitle1"
            component="div"
            className="productCatalog-title"
          >
            {product.title}
          </Typography>
        </LinkUi>
        <div>
          <Typography
            variant="subtitle1"
            component="span"
            className="productCatalog-price"
          >
            {product.price} {currsymbol}
          </Typography>
          <Typography
            variant="subtitle2"
            component="span"
            className="productCatalog-oldprice"
          >
            {product.old_price} {currsymbol}
          </Typography>
        </div>
      </CardContent>
    </CssRootCard>
  );
};

export default ProductForCatalog;
