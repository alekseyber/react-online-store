import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import Box from '@material-ui/core/Box';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Collapse from '@material-ui/core/Collapse';
import Typography from '@material-ui/core/Typography';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import IconButton from '@material-ui/core/IconButton';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import LinearProgress from '@material-ui/core/LinearProgress';
import { YMaps, Map, Placemark } from "react-yandex-maps";

import DeliveryPvzDescr from '../deliverypvzdescr/Deliverypvzdescr';
import { setDelivery } from '../../redux/actions/delivery';




const useStyles = makeStyles((theme) => ({
    root: {
        minWidth: '60vw',
        //minHeight: "60vh",
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(1),
        //  display: 'flex',
    },

    list: {
        width: '100%',
        maxWidth: 400,
        // backgroundColor: theme.palette.background.paper,
    },
    nested: {
        paddingLeft: theme.spacing(3),
    },
    loader: {
        width: '100%',
        '& > * + *': {
            marginTop: theme.spacing(2),
        },
        marginBottom: theme.spacing(2),
    },
    drawerHeader: {
        display: 'flex',
        alignItems: 'center',
        padding: theme.spacing(0, 1),
        // necessary for content to be below app bar
        ...theme.mixins.toolbar,
        justifyContent: 'flex-start',
    },
}));




const ListItemPvz = ({ item, pvzSelect, index, cityid, dispatch }) => {
    const classes = useStyles();


    const handleClick = () => {
        setOpen(!open);
    };

    let selected = false;
    if (pvzSelect) {
        selected = (cityid === pvzSelect.cityid && item.$.Code === pvzSelect.Code);
    }

    const [open, setOpen] = useState(selected);

    const btnTitle = selected ? 'Выбрано' : 'Выбрать';

    const handleSetPvz = () => {

        const pvzSelect = {
            index,
            cityid,
            Code: item.$.Code,
            Name: item.$.Name,
            Address: item.$.Address,
            WorkTime: item.$.WorkTime,
            AddressComment: item.$.AddressComment
        };

        dispatch(setDelivery({ pvzSelect }));
    };

    const primaryEl = (
        <>
            <DeliveryPvzDescr item={item.$} />
            <Button onClick={handleSetPvz} variant="contained" color="primary" size="small" disabled={selected}>{btnTitle}</Button>
        </>
    );
    return (
        <>
            <Divider component="li" />
            <ListItem dense button>
                <ListItemText
                    primary={(<Typography variant="body2" component="div" className="font-weight-black">{item.$.Name}</Typography>)}
                    secondary={item.$.Address}
                    onClick={handleClick}
                />
                {open ? <ExpandLess /> : <ExpandMore />}
            </ListItem>
            <Collapse in={open} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                    <ListItem className={classes.nested} divider dense>
                        <ListItemText
                            primary={primaryEl}
                            disableTypography={true}
                        />
                    </ListItem>
                </List>
            </Collapse>

        </>
    )
}

ListItemPvz.propTypes = {
    item: PropTypes.object.isRequired,
    cityid: PropTypes.number.isRequired,
    index: PropTypes.number.isRequired,
    dispatch: PropTypes.func.isRequired,
    pvzSelect: PropTypes.oneOfType([
        PropTypes.object.isRequired,
        () => null
    ])
};

const MapItemPvz = ({ item, cityid, index, dispatch, pvzSelect }) => {

    let selected = false;
    if (pvzSelect) {
        selected = (cityid === pvzSelect.cityid && item.$.Code === pvzSelect.Code);
    }


    const options = {
        preset: 'islands#blueIcon'
    };

    if (selected) {
        options.preset = 'islands#blackDotIcon'
    }


    const coordinates = [item.$.coordY, item.$.coordX];

    // const properties = {
    //     hintContent: `<strong>${item.$.Name}</strong><br>${item.$.Address}`,
    //     balloonContentHeader: "Выбран ПВЗ:",
    //     balloonContentBody: item.$.Address,
    // };

    const handleSetPvz = () => {

        const pvzSelect = {
            index,
            cityid,
            Code: item.$.Code,
            Name: item.$.Name,
            Address: item.$.Address,
            WorkTime: item.$.WorkTime,
            AddressComment: item.$.AddressComment
        };

        dispatch(setDelivery({ pvzSelect }));
    };

    return <Placemark geometry={coordinates} options={options} onClick={handleSetPvz} />

}

MapItemPvz.propTypes = {
    item: PropTypes.object.isRequired,
    cityid: PropTypes.number.isRequired,
    index: PropTypes.number.isRequired,
    dispatch: PropTypes.func.isRequired,
    pvzSelect: PropTypes.oneOfType([
        PropTypes.object.isRequired,
        () => null
    ])
};

const MapPvz = ({ pvz, pvzSelect, cityid, dispatch }) => {
    const classes = useStyles();
    const [load, setLoad] = useState(true);

    //  const yaMapKey = process.env.YMAP_KEY || 'b43c189e-389a-4ccc-b79e-436d89a914ee';
    const yaMapKey = useSelector(state => state.start.yaMapKey);

    const query = {
        lang: 'ru_RU',
        coordorder: 'latlong',
        apikey: yaMapKey,
    }
    const center = [pvz[0].$.coordY, pvz[0].$.coordX];
    const mapData = {
        center,
        zoom: 11,
        controls: ["geolocationControl", "fullscreenControl", "zoomControl"]
    };
    const modules = ['control.GeolocationControl', 'control.FullscreenControl', 'control.ZoomControl']

    return (
        <YMaps query={query}>
            {load && (
                <div className={classes.loader}>
                    <Typography variant="subtitle2" component="div" align='center' gutterBottom>Загружаем карту ПВЗ...</Typography>
                    <LinearProgress color="primary" />
                </div>
            )}
            <Map defaultState={mapData} modules={modules} width="100%" height="60vh" onLoad={() => setLoad(false)}>
                {pvz.map((itemPvz, i) => <MapItemPvz
                    item={itemPvz}
                    key={i}
                    index={i}
                    pvzSelect={pvzSelect}
                    cityid={cityid}
                    dispatch={dispatch}
                />)}
            </Map>
        </YMaps>
    )

}

MapPvz.propTypes = {
    pvz: PropTypes.array.isRequired,
    cityid: PropTypes.number.isRequired,
    dispatch: PropTypes.func.isRequired,
    pvzSelect: PropTypes.oneOfType([
        PropTypes.object.isRequired,
        () => null
    ])
};


const DeliveryPvzSelComp = ({ pvz, cityid }) => {
    const classes = useStyles();
    const { pvzSelect } = useSelector(state => state.delivery);
    const dispatch = useDispatch();
    const theme = useTheme();

    let pvzSelectedStatus = false;
    if (pvzSelect) {
        pvzSelectedStatus = (cityid === pvzSelect.cityid);
    }

    const [open, setOpen] = useState(false);

    const toggleDrawer = (val) => (event) => {
        if (event && event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }

        setOpen(val);
    };


    if (pvz.length === 0) {
        return (
            <div className={classes.root}>
                <Typography variant="body1" component="div" className="font-weight-black">В этом городое нет доступных ПВЗ</Typography>
            </div>
        )
    }

    return (
        <div className={classes.root}>
            <Button onClick={toggleDrawer(true)} variant="contained" color="primary" size="small">Список ПВЗ</Button>
            {pvzSelectedStatus && <Box p={1} mt={1}>
                <Divider />
                <Typography variant="body1" component="div" className="font-weight-black">Выбран ПВЗ:</Typography>
                <DeliveryPvzDescr item={pvzSelect} selected={true} divider_end={true} />
            </Box>}
            <Box mt={1}>
                <MapPvz
                    pvz={pvz}
                    pvzSelect={pvzSelect}
                    cityid={cityid}
                    dispatch={dispatch}
                />
            </Box>
            <Drawer
                anchor='right'
                open={open}
                onClose={toggleDrawer(false)}
            //  onOpen={toggleDrawer(true)}

            >
                <div className={classes.drawerHeader}>
                    <IconButton onClick={toggleDrawer(false)}>
                        {theme.direction === 'rtl' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
                    </IconButton>
                    <Typography noWrap variant="body2" component="div" className="font-weight-black ml-1">Список ПВЗ</Typography>
                </div>
                {/* <Divider /> */}
                <List
                    className={classes.list}
                    dense
                >
                    {
                        pvz.map((item, index) => (
                            <ListItemPvz
                                item={item}
                                pvzSelect={pvzSelect}
                                index={index}
                                key={index}
                                cityid={cityid}
                                dispatch={dispatch}
                            />
                        ))
                    }
                </List>
            </Drawer>

        </div>

    )
}

DeliveryPvzSelComp.propTypes = {
    pvz: PropTypes.array.isRequired,
    cityid: PropTypes.number.isRequired,
};

export default DeliveryPvzSelComp;