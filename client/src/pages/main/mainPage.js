import React from "react";
import MetaTags from "react-meta-tags";
import Container from "@material-ui/core/Container";
import { Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import MainSlider from "../../components/mainslider/MainSlider";
import MainCatalog from "../../components/maincatalog/MainCatalog";
import MainBanner from "../../components/mainbanner/MainBanner";
import LoaderPage from "../../components/loaderpage/LoaderPage";
import PageContent from "../../components/pagecontent/PageContent";
import ProductsGrid from "../../containers/productsgrid/ProductsGrid";
import { MAIN_PAGE_QUERY } from "../../graphql/gqlQuery";
import { useQueryApp } from "../../hooks/appolloQueryApp.hook";
import ErrorContent from "../../components/errorcontent/ErrorContent";

const useStyles = makeStyles((theme) => ({
  hits: {
    marginTop: theme.spacing(5),
    marginBottom: theme.spacing(5),
  },
  hitstitle: {
    marginBottom: theme.spacing(3),
    fontWeight: 700,
  },
}));

export default () => {
  const classes = useStyles();

  const { data, loading, error } = useQueryApp(MAIN_PAGE_QUERY);

  if (loading) return <LoaderPage />;
  if (error) {
    return <ErrorContent />;
  }
  const baseApiUrl = data.baseApiUrl;
  const { categoryImgProperty } = data.paramsData;
  const categoryImgBase = baseApiUrl + categoryImgProperty;
  const mainData = data.mainPage;

  return (
    <>
      <MetaTags>
        <title>{mainData.meta.title}</title>
        <meta name="description" content={mainData.meta.description} />
        <meta name="keywords" content={mainData.meta.keywords} />
        <meta property="og:title" content={mainData.meta.title} />
        {/* <meta property="og:image" content="path/to/image.jpg" /> */}
      </MetaTags>
      {mainData.topslidervisible && (
        <MainSlider topSlider={mainData.topSlider} baseApiUrl={baseApiUrl} />
      )}
      <Container fixed>
        {mainData.maincatalogvisible && (
          <MainCatalog
            maincatalog={mainData.maincatalog}
            maincatalogcount={mainData.maincatalogcount}
            maincatalogprefix={mainData.maincatalogprefix}
            categoryImgBase={categoryImgBase}
          />
        )}
        {mainData.mainBanner && (
          <MainBanner
            mainBanner={mainData.mainBanner}
            baseApiUrl={baseApiUrl}
          />
        )}
        {mainData.hitData.length > 0 && (
          <div className={classes.hits}>
            <Typography
              variant="h6"
              component="div"
              align="center"
              className={classes.hitstitle}
            >
              {mainData.hittitle}
            </Typography>
            <ProductsGrid products={mainData.hitData} />
          </div>
        )}
        <PageContent title={mainData.title} content={mainData.content} />
      </Container>
    </>
  );
};
