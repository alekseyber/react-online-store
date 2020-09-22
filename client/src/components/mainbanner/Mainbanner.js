import React from 'react';
import PropTypes from 'prop-types';
import { Link } from "react-router-dom";
import { makeStyles, withStyles } from '@material-ui/core/styles';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
//import { Image } from '../../image/Image';

const CssButton = withStyles((theme) => ({
    root: {
        fontSize: "1vw",
        borderRadius: 0,
        marginTop: "0.4vw",
        padding: "0.4vw 1vw",
        '&:hover': {
            backgroundColor: '#fff',
            color: 'red',
        },
    },
}))(Button);



const useStyles = makeStyles((theme) => ({
    root: {
        marginTop: theme.spacing(3),
        marginBottom: theme.spacing(3),
    },
    media: {
        height: 0,
        paddingTop: '19%', // 1:1
        display: "flex"
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
        textAlign: "center"
    },
    title: {
        fontWeight: 700,
        fontSize: "2.7vw"
    },
    description: {
        fontSize: "1.9vw"
    }
}));


export const MainBanner = (props) => {

    const classes = useStyles();

    const mainBanner = props.mainBanner;
    const baseUrl = props.baseUrl;

    if (!mainBanner.visible) {
        return null
    }


    return (
        <div className={classes.root}>
            <CardMedia
                className={classes.media}
                image={baseUrl + mainBanner.imgBacgr}
            >
                <div className={classes.mediain}>
                    <div className={classes.banwrap}>
                        <div className={classes.title}>{mainBanner.title}</div>
                        <div className={classes.description}>{mainBanner.description}</div>
                        {mainBanner.btnLink.length > 0 && <div className="btnwr">
                            <CssButton variant="outlined" color="inherit" component={Link} to={mainBanner.btnLink}>{mainBanner.btnText}</CssButton>
                        </div>}
                    </div>
                </div>
            </CardMedia>
        </div >

    )
}

MainBanner.propTypes = {
    mainBanner: PropTypes.object,
    baseUrl: PropTypes.string,
};


export default MainBanner;