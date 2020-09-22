import React from 'react';
import { Link } from "react-router-dom";
//import config from 'react-global-configuration';
import { useSelector } from 'react-redux';
import withWidth, { isWidthDown, isWidthUp } from '@material-ui/core/withWidth';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import useScrollTrigger from '@material-ui/core/useScrollTrigger';
import { makeStyles } from '@material-ui/core/styles'; //fade, 
import DrawerApp from './Drawer/Drawer';
import MenuItemBtn from './Menuitem/Menuitem';
import SmallCart from './Smallcart/Smallcart';
import Search from './Search/Search';



const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    rootBar: {
        backgroundColor: theme.palette.background.default,
        color: theme.palette.primary.dark,
    },
    // menuButton: {
    //     marginRight: theme.spacing(2),
    // },
    tollger: {
        flexGrow: "0.1",
    },
    logo: {
        flexGrow: "0.1",
        display: "flex",
        justifyContent: "center",
        [theme.breakpoints.down('sm')]: {
            flexGrow: "0.8",
        },
    },
    logoImg: {
        maxWidth: "110px",
        height: "auto",
    },
    topMenu: {
        flexGrow: .2,
        minHeight: "64px",
        display: "flex"
    },
    search: {
        flexGrow: .6,
        display: "block",
        // justifyContent: "center",
    },
    smalcart: {
        flexGrow: .1,
        minHeight: "64px",
        display: "flex",
        justifyContent: "center",
        marginLeft: theme.spacing(1),
    }

}));

const options = {
    threshold: 10
}

const AppBarAppF = (props) => {


    const { paramsData, categorytreeData, baseUrl } = useSelector(state => state.start);
    const classes = useStyles();
    const trigger = useScrollTrigger(options);

    if (!paramsData.select) return null

    // const baseUrl = config.get('baseUrl');
    // const categoryImgProperty = paramsData.categoryImgProperty;

    const imgStartPatch = baseUrl + paramsData.categoryImgProperty;


    return (
        <div className={classes.root}>
            <AppBar position={trigger ? "fixed" : "static"} className={classes.rootBar}>
                <Toolbar>
                    {isWidthDown('sm', props.width) &&
                        <div className={classes.tollger}>
                            <DrawerApp paramsData={paramsData} categorytreeData={categorytreeData} />
                        </div>
                    }
                    <Link to="/" className={classes.logo}>
                        <img src={baseUrl + paramsData.logoimg} className={classes.logoImg} alt={paramsData.shop_name_rus}></img>
                    </Link>
                    {isWidthUp('md', props.width) &&
                        <div className={classes.topMenu}>
                            <MenuItemBtn item={categorytreeData} root={true} />
                            {categorytreeData.childs.map((item) => (
                                <MenuItemBtn item={item} imgStartPatch={imgStartPatch} key={item._id} />
                            ))}
                        </div>
                    }
                    {isWidthUp('md', props.width) &&
                        <div className={classes.search}>
                            <Search />
                        </div>
                    }
                    <div className={classes.smalcart}>
                        <SmallCart />
                    </div>
                </Toolbar>
            </AppBar>
        </div>
    );
}

export default withWidth()(AppBarAppF);