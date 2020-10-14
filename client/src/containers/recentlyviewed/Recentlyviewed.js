import React, { useMemo, useEffect } from 'react'; //, , useCallback
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import ProductItem from '../productitem/ProductItem';
import { addRecentlyViewed } from '../../redux/actions/app'

const useStyles = makeStyles((theme) => ({
    root: {
        marginTop: theme.spacing(5),
        marginBottom: theme.spacing(5),
    },

}));

const RecentlyViewed = ({ alias, imgproperty, baseurl, quality, currsymbol }) => {
    const classes = useStyles();
    const recentlyViewed = useSelector(state => state.app.recentlyViewed);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(addRecentlyViewed(alias));
    }, [dispatch, alias]);


    const products = useMemo(() => {
        const rezult = [];
        if (recentlyViewed.length) {
            let q = 0;

            for (let i = 0; i < recentlyViewed.length; i++) {
                if (recentlyViewed[i] !== alias) {
                    rezult.push(recentlyViewed[i]);
                    q++;
                }

                if (q === 4) {
                    break;
                }
            }
        }

        return rezult;

    }, [recentlyViewed, alias]);

    if (products.length === 0) {
        return null;
    }

    return (
        <div className={classes.root}>
            <Typography gutterBottom variant="h6" component="h2">Недавно просмотренные</Typography>
            <Grid
                container
                spacing={2}
            >
                {products.map((item, index) => (

                    <ProductItem
                        item={item}                        
                        imgproperty={imgproperty}
                        baseurl={baseurl}
                        quality={quality}                        
                        currsymbol={currsymbol}
                        key={index}
                    />

                ))}
            </Grid>

        </div>
    )

}


RecentlyViewed.defaultProps = {
    currsymbol: "",
};

RecentlyViewed.propTypes = {
    alias: PropTypes.string.isRequired,    
    imgproperty: PropTypes.array.isRequired,
    baseurl: PropTypes.string.isRequired,
    quality: PropTypes.number.isRequired,
    currsymbol: PropTypes.string
};


export default RecentlyViewed;