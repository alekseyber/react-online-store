//import { useMemo } from "react";
import PropTypes from "prop-types";

const getSrcsetByImg = (img, imgproperty, baseurl = "", start = 0, end) => {
  ///images/product/1000/8a8d408fda1225032d55cf7590f13869.jpg 1000w,/images/product/300/8a8d408fda1225032d55cf7590f13869.jpg 300w,/images/product/160/8a8d408fda1225032d55cf7590f13869.jpg 160w
  let rezult = "";

  const count = end ?? imgproperty.length;

  let postfix = "";
  for (let i = start; i < count; i++) {
    postfix = ",";
    if (i === count - 1) postfix = "";
    rezult += `${baseurl}${imgproperty[i]["path"]}${img} ${imgproperty[i]["img_width"]}w${postfix}`;
  }

  return decodeURI(rezult);
};

const getimgPathSmallThumb = (imgproperty, baseurl = "") => {
  return baseurl + imgproperty[0].path;
};

const getimgPathThumb = (imgproperty, baseurl = "") => {
  return baseurl + imgproperty[1].path;
};

const getimgPath = (imgproperty, baseurl = "") => {
  return baseurl + imgproperty[3].path;
};

const useProductDataRender = ({
  colorselect,
  imgproperty,
  baseurl,
  qualityproductImg,
  productData,
  stateSelectColor,
}) => {
  let productDataInput = null;
  let productMainInput = null;
  if (productData) {
    if (productData.product) {
      productDataInput = productData.product;
    }
    if (productData.productMain) {
      productMainInput = productData.productMain;
    }
  } else {
    return null;
  }

  const product = { ...productDataInput };

  product.link = "/product/" + product.alias;

  product.stateSelectColor = stateSelectColor;

  product.current = null;

  if (colorselect) {
    product.current = product.level1Arr.find((el) => el.alias === colorselect);
  }

  if (!product.current && stateSelectColor) {
    product.current = product.level1Arr.find(
      (el) => el.alias === stateSelectColor
    );
  }

  if (!product.current) {
    product.current = product.level1Arr.find(
      (el) => el.alias === product.color_default
    );
  }

  if (!product.current) {
    product.current = product.level1Arr[0];
  }

  if (!product.current) {
    return null;
  }

  product.imgThumb =
    getimgPathSmallThumb(imgproperty, baseurl) + product.current.img;
  product.img = getimgPathThumb(imgproperty, baseurl) + product.current.img;

  const quality =
    qualityproductImg <= imgproperty.length ? qualityproductImg : 2;

  product.srcset = getSrcsetByImg(
    product.current.img,
    imgproperty,
    baseurl,
    0,
    quality
  );

  if (product.current.price > 0) {
    product.price = product.current.price;
  }
  if (product.current.old_price > 0) {
    product.old_price = product.current.old_price;
  }

  if (productMainInput) {
    product.gal = [];

    const gal = productMainInput.level1GalArr.find(
      (elGal) => elGal.alias === product.current.alias
    );
    if (gal) {
      gal.imgs.forEach((element) => {
        product.gal.push({
          img: getimgPath(imgproperty, baseurl) + element,
          imgThumb: getimgPathSmallThumb(imgproperty, baseurl) + element,
          srcset: getSrcsetByImg(element, imgproperty, baseurl, 1),
        });
      });
    }

    if (product.gal.length === 0) {
      product.gal.push({
        img: getimgPath(imgproperty, baseurl) + product.current.img,
        imgThumb: product.imgThumb,
        srcset: getSrcsetByImg(product.current.img, imgproperty, baseurl, 1),
      });
    }
  }
  return product;

  // return useMemo(() => {
  //   if (!productDataInput) {
  //     return null;
  //   }

  //   const product = Object.assign({}, productDataInput);
  //   product.link = "/product/" + product.alias;

  //   product.stateSelectColor = stateSelectColor;

  //   product.current = null;

  //   if (colorselect) {
  //     product.current = product.level1Arr.find(
  //       (el) => el.alias === colorselect
  //     );
  //   }

  //   if (!product.current && stateSelectColor) {
  //     product.current = product.level1Arr.find(
  //       (el) => el.alias === stateSelectColor
  //     );
  //   }

  //   if (!product.current) {
  //     product.current = product.level1Arr.find(
  //       (el) => el.alias === product.color_default
  //     );
  //   }

  //   if (!product.current) {
  //     product.current = product.level1Arr[0];
  //   }

  //   if (!product.current) {
  //     return null;
  //   }

  //   product.imgThumb =
  //     getimgPathSmallThumb(imgproperty, baseurl) + product.current.img;
  //   product.img = getimgPathThumb(imgproperty, baseurl) + product.current.img;

  //   const quality =
  //     qualityproductImg <= imgproperty.length ? qualityproductImg : 2;

  //   product.srcset = getSrcsetByImg(
  //     product.current.img,
  //     imgproperty,
  //     baseurl,
  //     0,
  //     quality
  //   );

  //   if (product.current.price > 0) {
  //     product.price = product.current.price;
  //   }
  //   if (product.current.old_price > 0) {
  //     product.old_price = product.current.old_price;
  //   }

  //   if (productMainInput) {
  //     product.gal = [];

  //     const gal = productMainInput.level1GalArr.find(
  //       (elGal) => elGal.alias === product.current.alias
  //     );
  //     if (gal) {
  //       gal.imgs.forEach((element) => {
  //         product.gal.push({
  //           img: getimgPath(imgproperty, baseurl) + element,
  //           imgThumb: getimgPathSmallThumb(imgproperty, baseurl) + element,
  //           srcset: getSrcsetByImg(element, imgproperty, baseurl, 1),
  //         });
  //       });
  //     }

  //     if (product.gal.length === 0) {
  //       product.gal.push({
  //         img: getimgPath(imgproperty, baseurl) + product.current.img,
  //         imgThumb: product.imgThumb,
  //         srcset: getSrcsetByImg(product.current.img, imgproperty, baseurl, 1),
  //       });
  //     }
  //   }

  //   return product;
  // }, [
  //   productDataInput,
  //   productMainInput,
  //   colorselect,
  //   imgproperty,
  //   baseurl,
  //   qualityproductImg,
  //   stateSelectColor,
  // ]);
};

useProductDataRender.defaultProps = {
  main: false,
  baseurl: "",
  quality: 3,
  //  currsymbol: ""
};

useProductDataRender.propTypes = {
  productData: PropTypes.oneOfType([
    PropTypes.oneOf([undefined]),
    PropTypes.object,
  ]),
  colorselect: PropTypes.oneOfType([
    PropTypes.oneOf([undefined]),
    PropTypes.string,
  ]),
  bagdes: PropTypes.object.isRequired,
  imgproperty: PropTypes.array.isRequired,
  baseurl: PropTypes.string,
  qualityproductImg: PropTypes.number,
  main: PropTypes.bool,
  stateSelectColor: PropTypes.oneOfType([
    PropTypes.oneOf([undefined]),
    PropTypes.string,
  ]),
};

export { useProductDataRender };
