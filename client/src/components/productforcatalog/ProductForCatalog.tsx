import React from "react";
//import PropTypes from "prop-types";
import { Link } from "react-router-dom"; //, useHistory
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import LinkUi from "@material-ui/core/Link";
import DoneIcon from "@material-ui/icons/Done";
import { Image } from "../image/Image";
import { setColorProductAction } from "../../graphql/localVarsCart";
import { useRouter } from "../../hooks/router.hook";
import { IProductRezult } from "../../hooks/useProductDataRender.hook";
import { TProductLevel1 } from "../../graphql/gqlQuery";

const useStyles = makeStyles((theme) => ({
  root: {
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
  },
  header: {
    position: "relative",
    "& > div": {
      position: "absolute",
      zIndex: 10,
      top: theme.spacing(1),
    },
  },
  badgewrap: {
    width: "36%",
    left: theme.spacing(1),
  },
  badge: {
    padding: "2px 6px",
    color: "#fff",
  },
  colorwrap: {
    width: "52%",
    right: theme.spacing(1),
    display: "flex",
    justifyContent: "flex-end",
    flexWrap: "wrap",
  },
  title: {
    fontWeight: 700,
    minHeight: "3.5rem",
  },
  price: {
    fontWeight: 700,
    color: theme.palette.priceprimary.main,
  },
  oldprice: {
    fontWeight: 700,
    marginLeft: theme.spacing(1),
    textDecoration: "line-through",
    color: theme.palette.priceprimary.light,
  },
  color: {
    "&:hover": {
      textDecoration: "none",
    },
    margin: "3px",
  },
  colorav: {
    width: "15px",
    height: "15px",
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

const ProductForCatalog: React.FC<ProductForCatalogProps> = ({
  product,
  currsymbol,
}) => {
  const classes = useStyles();
  const { history } = useRouter();

  const handleCardClick = () => {
    if (product.current.alias !== product.stateSelectColor) {
      setColorProductAction(
        product.alias,
        product.current.alias,
        product.current.level2
      );
    }
    history.push(product.link);
  };

  //event: ChangeEvent<HTMLInputElement>
  const preventDefault = (event: React.SyntheticEvent) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const handleColorHover = (color: string) => {
    setColorProductAction(product.alias, color, product.current.level2);
  };

  const badge = product.current.bagdeItem ? (
    <div
      className={classes.badge}
      style={{ backgroundColor: `#${product.current.bagdeItem.colorkey}` }}
    >
      {product.current.bagdeItem.title}
    </div>
  ) : null;

  const Colorlevel: React.FC = () => {
    if (product.product_model > 2) return null;

    const ColorItem: React.FC<ColorItemProps> = ({ item }) => {
      const href =
        product.color_default !== item.alias
          ? `${product.link}?colors=${item.alias}`
          : product.link;

      return (
        <LinkUi
          href={href}
          color="inherit"
          className={classes.color}
          onClick={preventDefault}
          onMouseEnter={() => handleColorHover(item.alias)}
        >
          <div
            className={classes.colorav}
            style={{ backgroundColor: "#" + item.colorItem.colorkey }}
          >
            {item.alias === product.current.alias && <DoneIcon />}
          </div>
        </LinkUi>
      );
    };

    // ColorItem.propTypes = {
    //   item: PropTypes.object.isRequired,
    // };

    return (
      <>
        {product.level1Arr.map((item, index) => (
          <ColorItem key={index} item={item} />
        ))}
      </>
    );
  };

  return (
    <Card className={classes.root} onClick={handleCardClick}>
      <div className={classes.header}>
        <div className={classes.badgewrap}>{badge}</div>
        <div className={classes.colorwrap}>
          <Colorlevel />
        </div>
      </div>
      <CardMedia>
        <Image
          // className={classes.media}
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
          //  className={classes.link}
        >
          <Typography variant="subtitle2" color="textSecondary" component="div">
            {product.gender}
          </Typography>
          <Typography
            variant="subtitle1"
            component="div"
            className={classes.title}
          >
            {product.title}
          </Typography>
        </LinkUi>
        <div>
          <Typography
            variant="subtitle1"
            //  color="initial"
            component="span"
            className={classes.price}
          >
            {product.price} {currsymbol}
          </Typography>
          <Typography
            variant="subtitle2"
            component="span"
            className={classes.oldprice}
          >
            {product.old_price} {currsymbol}
          </Typography>
        </div>
      </CardContent>
    </Card>
  );
};

// ProductForCatalog.defaultProps = {
//   currsymbol: "",
// };

// ProductForCatalog.propTypes = {
//   product: PropTypes.object.isRequired,
//   currsymbol: PropTypes.string,
// };

export default ProductForCatalog;
