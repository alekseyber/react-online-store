import React from 'react';
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import LinkUi from '@material-ui/core/Link';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import Icon from '@material-ui/core/Icon';
import withWidth, { isWidthUp } from '@material-ui/core/withWidth';
import { HideOnScroll } from '../../hoc/HideOnScrool';
import { openDelivery } from '../../redux/actions/modaldialog';


const useStyles = makeStyles((theme) => ({
    root: {
        backgroundColor: theme.palette.primary.dark,
        color: theme.palette.primary.contrastText,
        boxShadow: 'none'
    },
    wrap: {
        display: "flex",
        justifyContent: "space-between",
        fontWeight: 500,
        minHeight: 33,
        textTransform: "uppercase",
        fontSize: ".75rem"
    },
    phone: {
        fontSize: ".875rem"
    },
    linkIc: {
        alignItems: "center",
        display: "flex"
    },
    divid: {
        backgroundColor: theme.palette.primary.contrastText,
        height: "15px",
        alignSelf: "center",
        // marginLeft: theme.spacing(2),
    },
    icons: {
        marginRight: theme.spacing(1),
        //  marginRight: "5px"
    },
    links: {
        width: 'fit-content',
        color: theme.palette.primary.contrastText,
        '& > *': {
            marginLeft: theme.spacing(2),
            color: theme.palette.primary.contrastText,
            // fontWeight: 600,
        },
        '& > button': {
            //  fontWeight: 600
        },
        '& > a:hover': {
            fontWeight: 600,
            textDecoration: "none",
        },
        '& > a': {
            textDecoration: "none",
        },
        '& > button:hover': {
            fontWeight: 600
        },
    },
}));



const TopBarAppF = (props) => {
    const dispatch = useDispatch();
    const { paramsData } = useSelector(state => state.start);
    const { cityName } = useSelector(state => state.delivery.city)
    // const dispatch = useDispatch();
    const classes = useStyles();
    //const preventDefault = (event) => event.preventDefault();

    const deliveryBtnHandler = () => {
        dispatch(openDelivery());
    };


    if (!paramsData.select) return null

    return (
        <HideOnScroll {...props}>
            <AppBar color="inherit" className={classes.root} position="sticky">
                <Toolbar className={classes.wrap}>
                    <Grid container className={classes.links} alignItems="center" spacing={1}>
                        <LinkUi
                            href={`tel:${paramsData.phone.href}`}
                            color="inherit" variant="inherit"
                            className={classes.phone}
                        >{paramsData.phone.title}</LinkUi>
                        <Divider orientation="vertical" className={classes.divid} flexItem />
                        <Button onClick={deliveryBtnHandler}>{cityName}</Button>
                    </Grid>
                    {isWidthUp('md', props.width) &&
                        <Grid container className={classes.links} alignItems="center" spacing={1}>
                            {paramsData.topLinks.map((item, index) => (
                                <LinkUi key={index} component={Link} to={item.url} color="inherit" variant="inherit" className={classes.linkIc}>
                                    <Icon fontSize="small" className={classes.icons}>{item.icons}</Icon>
                                    {item.title}
                                </LinkUi>
                            ))}
                        </Grid>
                    }
                </Toolbar>
            </AppBar>
        </HideOnScroll>
    )
}


export default withWidth()(TopBarAppF);