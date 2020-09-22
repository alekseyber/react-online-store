import { useMemo } from 'react';
import PropTypes from 'prop-types';
//import { useSelector } from 'react-redux';


const getSrcsetByImg = (img, imgproperty, baseurl = "", start = 0, end) => {
    ///images/product/1000/8a8d408fda1225032d55cf7590f13869.jpg 1000w,/images/product/300/8a8d408fda1225032d55cf7590f13869.jpg 300w,/images/product/160/8a8d408fda1225032d55cf7590f13869.jpg 160w
    let rezult = "";

    const count = end ?? imgproperty.length;

    let postfix = "";
    for (let i = start; i < count; i++) {
        postfix = ","
        if (i === (count - 1)) postfix = "";
        rezult += `${baseurl}${imgproperty[i]['path']}${img} ${imgproperty[i]['img_width']}w${postfix}`
    }

    return decodeURI(rezult)
}

const getimgPathSmallThumb = (imgproperty, baseurl = "") => {
    return baseurl + imgproperty[0].path;
}

const getimgPathThumb = (imgproperty, baseurl = "") => {
    return baseurl + imgproperty[1].path;
}

const getimgPath = (imgproperty, baseurl = "") => {
    return baseurl + imgproperty[3].path;
}


const useProductDataRender = ({ colorselect, imgproperty, baseurl, quality, bagdes, main, productData, stateSelectColor }) => {

    // const selectColor = useSelector(state => state.productselect.color[alias]);

    return useMemo(() => {
        if (!productData) {
            return null
        }

        const product = Object.assign({}, productData);
        //  product.alias = alias;
        product.link = '/product/' + product.alias;
        let defaultcolorvalue = product.color_default;
        product.stateSelectColor = stateSelectColor;

        if (colorselect) {
            defaultcolorvalue = colorselect;
            if ((defaultcolorvalue in product.level1) === false) {
                return null
            }
            // if (!forcart) {
            //     const tempobj = {};
            //     tempobj[defaultcolorvalue] = product.level1[defaultcolorvalue];
            //     product.level1 = tempobj;
            // }

            product.color_select = colorselect;
        } else {
            if (stateSelectColor) {
                defaultcolorvalue = stateSelectColor
            } else if (!(defaultcolorvalue in product.level1)) {
                const levelColorsArr = Object.keys(product.level1);
                defaultcolorvalue = levelColorsArr[0];
            }
        }


        product.imgThumb = getimgPathSmallThumb(imgproperty, baseurl) + product.level1[defaultcolorvalue].img;
        product.img = getimgPathThumb(imgproperty, baseurl) + product.level1[defaultcolorvalue].img;

        const qualityproductImg = quality <= imgproperty.length ? quality : 2;

        product.srcset = getSrcsetByImg(product.level1[defaultcolorvalue].img, imgproperty, baseurl, 0, qualityproductImg);

        if (product.level1[defaultcolorvalue].price > 0) {
            product.price = product.level1[defaultcolorvalue].price;
        }
        if (product.level1[defaultcolorvalue].old_price > 0) {
            product.old_price = product.level1[defaultcolorvalue].old_price;
        }
        product.badge = false
        if (product.level1[defaultcolorvalue].bagde_id !== null) {

            if (product.level1[defaultcolorvalue].bagde_id in bagdes) {
                product.badge = {
                    text: bagdes[product.level1[defaultcolorvalue].bagde_id].text,
                    colorkey: bagdes[product.level1[defaultcolorvalue].bagde_id].colorkey
                }
            }

        }

        product.select_color = defaultcolorvalue;

        product.select_level2 = product.level1[defaultcolorvalue].level2 ?? [];

        if (main) {
            product.gal = [];
            if (productData.mainData) {

                const gal = productData.mainData.level1[defaultcolorvalue];
                if (gal) {

                    gal.forEach(element => {
                        product.gal.push({
                            img: getimgPath(imgproperty, baseurl) + element,
                            imgThumb: getimgPathSmallThumb(imgproperty, baseurl) + element,
                            srcset: getSrcsetByImg(element, imgproperty, baseurl, 1)
                        })
                    });
                }

            }

            if (product.gal.length === 0) {
                product.gal.push({
                    img: getimgPath(imgproperty, baseurl) + product.level1[defaultcolorvalue].img,
                    imgThumb: product.imgThumb,
                    srcset: getSrcsetByImg(product.level1[defaultcolorvalue].img, imgproperty, baseurl, 1)
                })
            }
        }

        // if (sizeFilter) {

        //     const level1 = {};
        //     Object.keys(product.level1).forEach((item) => {
        //         if (item === defaultcolorvalue) {
        //             level1[item] = product.level1[item];
        //             return true;
        //         }
        //         if (product.level1[item].level2.findIndex(el => el === sizeFilter) > -1) {
        //             level1[item] = product.level1[item];
        //         }
        //     });
        //     product.level1 = level1;
        // }

        return product;

    }, [productData, colorselect, imgproperty, baseurl, quality, bagdes, stateSelectColor, main]);

}

useProductDataRender.defaultProps = {
  //  forcart: false,
    main: false,
    baseurl: "",
    quality: 3
    //  currsymbol: ""
};

useProductDataRender.propTypes = {
    productData: PropTypes.oneOfType([PropTypes.oneOf([undefined]), PropTypes.object]),
    colorselect: PropTypes.oneOfType([PropTypes.oneOf([undefined]), PropTypes.string]),
    //  colors: PropTypes.object.isRequired,
    //  sizes: PropTypes.object.isRequired,
    bagdes: PropTypes.object.isRequired,
    imgproperty: PropTypes.array.isRequired,
    //alias: PropTypes.string.isRequired,
    baseurl: PropTypes.string,
    quality: PropTypes.number,
   // forcart: PropTypes.bool,
    main: PropTypes.bool,
    stateSelectColor: PropTypes.oneOfType([PropTypes.oneOf([undefined]), PropTypes.string]),
   // sizeFilter: PropTypes.oneOfType([PropTypes.oneOf([undefined]), PropTypes.string]),
    // currsymbol: PropTypes.string
};


export { useProductDataRender };