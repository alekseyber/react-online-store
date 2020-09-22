import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
//import config from 'react-global-configuration';
import MetaTags from 'react-meta-tags';
import Container from '@material-ui/core/Container';
import { Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { mainFetch } from '../../redux/actions/main';
import MainSlider from '../../components/mainslider/Mainslider';
import MainCatalog from '../../components/maincatalog/Maincatalog';
import MainBanner from '../../components/mainbanner/Mainbanner';
import LoaderPage from '../../components/loaderpage/Loader';
import PageContent from '../../components/htmlcontent/Htmlcontent';
import Products from '../../containers/products/Products';

const useStyles = makeStyles((theme) => ({
    hits: {
        marginTop: theme.spacing(5),
        marginBottom: theme.spacing(5),
    },
    hitstitle: {
        marginBottom: theme.spacing(3),
        fontWeight: 700
    }

}));

export default () => {

    const classes = useStyles();
    const mainData = useSelector(state => state.main);
    const baseUrl = useSelector(state => state.start.baseUrl);
    const loading = useSelector(state => state.app.pageloading);
    const dispatch = useDispatch();
  
   // const baseUrl = config.get('baseUrl');


    useEffect(() => {
        dispatch(mainFetch());
    }, [dispatch]);



    if (loading) return <LoaderPage />

    return (
        <>
            <MetaTags>
                <title>{mainData.meta.title}</title>
                <meta name="description" content={mainData.meta.description} />
                <meta name="keywords" content={mainData.meta.keywords} />
                <meta property="og:title" content={mainData.meta.title} />
                {/* <meta property="og:image" content="path/to/image.jpg" /> */}
            </MetaTags>
            {mainData.topslidervisible && <MainSlider topSlider={mainData.topSlider} baseUrl={baseUrl} />}
            <Container fixed>
                {mainData.maincatalogvisible && <MainCatalog
                    maincatalog={mainData.maincatalog}
                    maincatalogcount={mainData.maincatalogcount}
                    maincatalogprefix={mainData.maincatalogprefix}
                    baseUrl={baseUrl}
                />}
                {mainData.mainBanner && <MainBanner
                    mainBanner={mainData.mainBanner}
                    baseUrl={baseUrl}
                />}
                {mainData.hitData.length > 0 &&
                    <div className={classes.hits}>
                        <Typography variant="h6" component="div" align="center" className={classes.hitstitle}>
                            {mainData.hittitle}
                        </Typography>
                        <Products
                            products={mainData.hitData}
                            hits={true}
                        />
                    </div>
                }
                <PageContent title={mainData.title} content={mainData.content}/>
            </Container>
        </>
    )
}