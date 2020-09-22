import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { Link } from "react-router-dom";
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';

//import { Image } from '../image/Image';

import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles((theme) => ({
    root: {
        marginTop: theme.spacing(2),
        marginBottom: theme.spacing(2),
    },
    card: {
        "&:hover": {
            boxShadow: "0 5px 5px -3px rgba(0,0,0,.2), 0 8px 10px 1px rgba(0,0,0,.14), 0 3px 14px 2px rgba(0,0,0,.12)",
            "& $mediain": {
                transform: "scaleY(1)"
            }
        },
        transition: "box-shadow .4s cubic-bezier(.25,.8,.25,1)",
        transitionProperty: "box-shadow",
        transitionDuration: "0.4s",
        transitionTimingFunction: "cubic-bezier(0.25, 0.8, 0.25, 1)",
        transitionDelay: "0s",
        textDecoration: "none",
        display: "block"
    },
    media: {
        height: 0,
        paddingTop: '100%', // 1:1
        display: "flex"
    },
    mediain: {
        marginTop: "-100%",
        backgroundColor: "rgba(0,0,0,.2)",
        width: "100%",
        color: "#fff",
        overflow: "hidden",
        alignItems: "center",
        display: "flex",
        justifyContent: "center",
        transform: "scaleY(0)",
        transformOrigin: "bottom",
        transition: "transform 0.26s ease"
    },
    title: {
        fontWeight: 700
    }
}));



const MainCatalog = (props) => {

    const { paramsData } = useSelector(state => state.start);


    const classes = useStyles();

    //const preventDefault = (event) => event.preventDefault();

    if (!paramsData.select) {
        return null
    }


    const mainCatalog = props.maincatalog;
    const baseUrl = props.baseUrl + paramsData.categoryImgProperty;
    const mainCatalogPrefix = props.maincatalogprefix;
    const maincatalogcount = (props.maincatalogcount === 3) ? 3 : 4;
    const sm = (maincatalogcount === 3) ? 4 : 6;
    const md = (maincatalogcount === 3) ? 4 : 3;


    return (

        <Grid
            container
            spacing={3}
            className={classes.root}
        >

            {mainCatalog.map((item, index) => (
                <Grid item xs={12} sm={sm} md={md} key={index}>
                    <Card className={classes.card} component={Link} to={"/category/" + item.alias}>
                        <CardMedia
                            className={classes.media}
                            image={baseUrl + item.img}
                        //  title={item.title}
                        >
                            <div className={classes.mediain}>
                                <Typography variant="h5" component="div" color="inherit">Открыть {item.title}</Typography>
                            </div>
                        </CardMedia>
                        <CardContent>
                            {mainCatalogPrefix.length > 0 && <Typography variant="h5" component="div" color='secondary'>{mainCatalogPrefix}</Typography>}
                            <Typography variant="h5" component="div" className={classes.title}>{item.title}</Typography>
                        </CardContent>
                    </Card>
                </Grid>
            ))}
        </Grid>


    )
}

MainCatalog.propTypes = {
    maincatalog: PropTypes.array,
    baseUrl: PropTypes.string,
    maincatalogprefix: PropTypes.string,
    maincatalogcount: PropTypes.number,
};

export default MainCatalog;