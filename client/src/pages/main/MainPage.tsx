import { FC } from "react";
import { Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import MainSlider from "../../components/mainslider/MainSlider";
import MainCatalog from "../../components/maincatalog/MainCatalog";
import MainBanner from "../../components/mainbanner/MainBanner";
import LoaderPage from "../../components/loaderpage/LoaderPage";
import PageContent from "../../components/pagecontent/PageContent";
import ProductsGrid from "../../containers/productsgrid/ProductsGrid";
import { PageBase, IPageBaseProps } from "../../hoc/PageBase";
import { MAIN_PAGE_QUERY, IMainPage } from "../../graphql/gqlQuery";
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

const MainPage: FC = () => {
  const classes = useStyles();

  const { data, loading, error } = useQueryApp<IMainPage>(MAIN_PAGE_QUERY);

  if (loading) return <LoaderPage />;
  if (error) {
    return <ErrorContent />;
  }
  if (!data) {
    return null;
  }
  const baseApiUrl = data.baseApiUrl;
  const { categoryImgProperty } = data.paramsData;
  const categoryImgBase = baseApiUrl + categoryImgProperty;
  const mainData = data.mainPage;

  // const slider = mainData.topslidervisible ? (
  //   <MainSlider topSlider={mainData.topSlider} baseApiUrl={baseApiUrl} />
  // ) : null;

  const Slider: FC = () => {
    if (mainData.topslidervisible) {
      return (
        <MainSlider topSlider={mainData.topSlider} baseApiUrl={baseApiUrl} />
      );
    }
    return null;
  };

  const bind: IPageBaseProps = {
    name_page: mainData.meta.title,
    action_page: mainData.meta.description,
    meta_key: mainData.meta.keywords,
    link_page: "/",
    meta_full: true,
    canonical_on: true,
    breadcrumbs_on: false,
    Slider,
    filter_on: false,
  };

  return (
    <PageBase {...bind}>
      {mainData.maincatalogvisible && (
        <MainCatalog
          maincatalog={mainData.maincatalog}
          maincatalogcount={mainData.maincatalogcount}
          maincatalogprefix={mainData.maincatalogprefix}
          categoryImgBase={categoryImgBase}
        />
      )}
      {mainData.mainBanner && (
        <MainBanner mainBanner={mainData.mainBanner} baseApiUrl={baseApiUrl} />
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
      <PageContent content={mainData.content} />
    </PageBase>
  );
};

export default MainPage;
