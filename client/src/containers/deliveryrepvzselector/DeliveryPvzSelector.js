import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import LinearProgress from '@material-ui/core/LinearProgress';
import Typography from '@material-ui/core/Typography';
import { pvzFetch } from '../../redux/actions/delivery';
import DeliveryPvzSelComp from '../../components/deliveryrepvzselcomp/DeliveryPvzSelComp';

const useStyles = makeStyles((theme) => ({
    loader: {
        width: '100%',
        '& > * + *': {
            marginTop: theme.spacing(2),
        },
        marginBottom: theme.spacing(2),
    },


}));

const DeliveryPvzSelector = () => {
    const classes = useStyles();
    const { city, pvzList } = useSelector(state => state.delivery);
    const cityid = city.id;
    const pvzNoLoaded = ((pvzList && (pvzList.cityid !== cityid)) || !pvzList);

    const dispatch = useDispatch();

    useEffect(() => {       
        if (pvzNoLoaded && cityid) {           
            dispatch(pvzFetch(cityid));
        }
    }, [cityid, pvzNoLoaded, dispatch])


    if (pvzNoLoaded) {
        return (
            <div className={classes.loader}>
                <Typography variant="subtitle2" component="div" align='center' gutterBottom>Загружаем список ПВЗ...</Typography>
                <LinearProgress color="secondary" />
            </div>
        )
    }

    return <DeliveryPvzSelComp pvz={pvzList.pvz} cityid={cityid}/>
}



export default DeliveryPvzSelector;