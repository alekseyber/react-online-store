import React, { useState } from 'react';
import PropTypes from 'prop-types';
//import clsx from 'clsx';
//import Card from '@material-ui/core/Card';
import Carousel from "react-material-ui-carousel";
import CardMedia from '@material-ui/core/CardMedia';
import { makeStyles } from '@material-ui/core/styles';
import { Image } from '../image/Image';

const useStyles = makeStyles((theme) => ({
    productcarusel: {
        height: "100%",
        overflow: "hidden"
        // marginTop: theme.spacing(5),
        // marginBottom: theme.spacing(5),
    },
    productthumb: {
        display: 'flex',
        justifyContent: 'center'
    },
    imagethumb: {
        '& > img': {
            maxWidth: "40px",
            border: "1px solid #ccc",
            borderRadius: "3px",
            "&:hover": {
                opacity: "0.7"
            },
        },
        margin: theme.spacing(.4),


    },
    // activethumb: {
    //     '& > img': {
    //         border: "1px solid #000",
    //         opacity: "0.7",
    //     },
    // }

}));





const ProductImgCarusel = ({ gal, title }) => {
    const classes = useStyles();
    const initial = 0;
    const [renderToggle, setRenderToggle] = useState(initial);
    const [start, setStart] = useState(initial);

    const handleChange = (active) => {
        const toogle = (active === start);
        setStart(active);
        if (toogle) {
            setRenderToggle(!renderToggle)
        }

    }

    const countImg = gal.length;


    const CaruselEl = ({ startAt }) => {

        const ItemSlide = ({ item, posistion }) => {

            const altText = `${title} ${posistion + 1} из ${countImg}`;

            return (
                <CardMedia>
                    <Image
                        // className={classes.media}
                        src={item.img}
                        srcset={item.srcset}
                        title={altText}
                        alt={altText}
                    //  disableSpinner
                    />
                </CardMedia>
            )
        }

        return <Carousel
            className={classes.productcarusel}
            autoPlay={false}
            timer={0}
            indicators={true}
            navButtonsAlwaysVisible={true}
            // onChange={(_, active) => { setCurrentImg(active) }}
            startAt={startAt}

        >
            {
                gal.map((item, index) => {
                    return <ItemSlide item={item} posistion={index} key={index} />
                })
            }
        </Carousel>

    }


    const ItemThumb = ({ item, posistion }) => {

        const altText = `Thumb ${title} ${posistion + 1} из ${countImg}`;

        // const classArr = [classes.imagethumb];
        // if (currentImg === posistion) {
        //     classArr.push(classes.activethumb);
        // }
        // const className = clsx(classArr);
        return (
            <div
                className={classes.imagethumb}
                onClick={() => { handleChange(posistion) }}
            >
                <img
                    alt={altText}
                    src={item.imgThumb}
                />
            </div>
        )
    }






    return (
        <div>
            <CaruselEl startAt={start} />
            <div className={classes.productthumb}>
                {
                    gal.map((item, index) => {
                        return <ItemThumb item={item} posistion={index} key={index} />
                    })
                }
            </div>
        </div>
    )

}


ProductImgCarusel.propTypes = {
    gal: PropTypes.array.isRequired,
    title: PropTypes.string.isRequired
};


export default ProductImgCarusel;