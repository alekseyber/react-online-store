//import { useMemo } from "react";
import { getLinkByRoutePath } from "../router";
import {
  TProductImgProperty,
  ProductFragment,
  TStateSelectColor,
  ProductMainPageProductFragment,
  TProductLevel1,
} from "../graphql/gqlQuery";

interface IProductData {
  product: ProductFragment;
  productMain?: ProductMainPageProductFragment;
}

export interface IProductGalItem {
  imgThumb: string;
  img: string;
  srcset: string;
}

export interface IProductRezult extends ProductFragment, IProductGalItem {
  link: string;
  stateSelectColor: TStateSelectColor;
  current: TProductLevel1;
  gal: IProductGalItem[];
}

interface IUseProductDataRender {
  imgproperty: TProductImgProperty[];
  qualityproductImg: number;
  productData: IProductData | null | undefined;
  colorselect?: undefined | null | string;
  baseurl: string;
  stateSelectColor: TStateSelectColor;
}

const getSrcsetByImg = (
  img: string,
  imgproperty: TProductImgProperty[],
  baseurl: string = "",
  start: number = 0,
  end?: number | undefined
): string => {
  ///images/product/1000/8a8d408fda1225032d55cf7590f13869.jpg 1000w,/images/product/300/8a8d408fda1225032d55cf7590f13869.jpg 300w,/images/product/160/8a8d408fda1225032d55cf7590f13869.jpg 160w
  let rezult = "";

  const count = end || imgproperty.length;

  let postfix = "";
  for (let i = start; i < count; i++) {
    postfix = ",";
    if (i === count - 1) postfix = "";
    rezult += `${baseurl}${imgproperty[i]["path"]}${img} ${imgproperty[i]["img_width"]}w${postfix}`;
  }

  return decodeURI(rezult);
};

const getimgPathSmallThumb = (
  imgproperty: TProductImgProperty[],
  baseurl: string = ""
): string => {
  return baseurl + imgproperty[0].path;
};

const getimgPathThumb = (
  imgproperty: TProductImgProperty[],
  baseurl: string = ""
): string => {
  return baseurl + imgproperty[1].path;
};

const getimgPath = (
  imgproperty: TProductImgProperty[],
  baseurl: string = ""
): string => {
  return baseurl + imgproperty[3].path;
};

const useProductDataRender = ({
  colorselect,
  imgproperty,
  baseurl,
  qualityproductImg,
  productData,
  stateSelectColor,
}: IUseProductDataRender): null | IProductRezult => {
  let productDataInput: ProductFragment | null = null;
  let productMainInput: ProductMainPageProductFragment | null = null; // | undefined
  if (productData) {
    if (productData.product) {
      productDataInput = productData.product;
    }
    if (productData.productMain) {
      productMainInput = productData.productMain;
    }
  }

  if (!productDataInput) {
    return null;
  }
  const link: string = getLinkByRoutePath(
    "PRODUCT_PAGE",
    productDataInput.alias
  );

  let current: TProductLevel1 | null | undefined = null;

  if (colorselect) {
    current = productDataInput.level1Arr.find((el) => el.alias === colorselect);
  }

  if (!current && stateSelectColor) {
    current = productDataInput.level1Arr.find(
      (el) => el.alias === stateSelectColor
    );
  }

  if (!current) {
    current = productDataInput.level1Arr.find((el) => {
      if (!productDataInput) {
        return false;
      }
      return el.alias === productDataInput.color_default;
    });
  }

  if (!current) {
    current = productDataInput.level1Arr[0];
  }

  if (!current) {
    return null;
  }

  const imgThumb: string =
    getimgPathSmallThumb(imgproperty, baseurl) + current.img;
  const img: string = getimgPathThumb(imgproperty, baseurl) + current.img;

  const quality =
    qualityproductImg <= imgproperty.length ? qualityproductImg : 2;

  const srcset: string = getSrcsetByImg(
    current.img,
    imgproperty,
    baseurl,
    0,
    quality
  );

  const product: IProductRezult = {
    ...productDataInput,
    link,
    stateSelectColor,
    current,
    imgThumb,
    img,
    srcset,
    gal: [],
  };

  if (product.current.price > 0) {
    product.price = product.current.price;
  }
  if (product.current.old_price > 0) {
    product.old_price = product.current.old_price;
  }

  // product.gal = [];

  if (productMainInput) {
    const gal = productMainInput.level1GalArr.find(
      (elGal) => elGal.alias === product.current.alias
    );
    if (gal) {
      gal.imgs.forEach((element) => {
        const candidatItemGal: IProductGalItem = {
          img: getimgPath(imgproperty, baseurl) + element,
          imgThumb: getimgPathSmallThumb(imgproperty, baseurl) + element,
          srcset: getSrcsetByImg(element, imgproperty, baseurl, 1),
        };
        if (product.gal) {
          product.gal.push(candidatItemGal);
        }
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

// useProductDataRender.defaultProps = {
//   baseurl: "",
//   qualityproductImg: 3,
// };

// useProductDataRender.propTypes = {
//   productData: PropTypes.oneOfType([
//     PropTypes.oneOf([undefined]),
//     PropTypes.object,
//   ]),
//   colorselect: PropTypes.oneOfType([
//     PropTypes.oneOf([undefined]),
//     PropTypes.string,
//   ]),
//   bagdes: PropTypes.object.isRequired,
//   imgproperty: PropTypes.array.isRequired,
//   baseurl: PropTypes.string,
//   qualityproductImg: PropTypes.number,
//   main: PropTypes.bool,
//   stateSelectColor: PropTypes.oneOfType([
//     PropTypes.oneOf([undefined]),
//     PropTypes.string,
//   ]),
// };

export { useProductDataRender };
