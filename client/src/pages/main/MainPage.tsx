import { FC } from "react";
import { Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import MainSlider from "../../components/mainslider/MainSlider";
import MainCatalog from "../../components/maincatalog/MainCatalog";
import MainBanner from "../../components/mainbanner/MainBanner";
import PageContent from "../../components/pagecontent/PageContent";
import ProductsGrid from "../../containers/productsgrid/ProductsGrid";
import { PageBase, IPageBaseProps } from "../../hoc/PageBase";
import { MAIN_PAGE_QUERY, IMainPage } from "../../graphql/gqlQuery";
import { useQueryApp } from "../../hooks/appolloQueryApp.hook";
import ErrorContent from "../../components/errorcontent/ErrorContent";
import ProductListSceleton from "../../components/skeletons/ProductListSceleton";
import PageSceleton from "../../components/skeletons/PageSceleton";

const CssHitsDiv = styled("div")(({ theme }) => ({
  marginTop: theme.spacing(5),
  marginBottom: theme.spacing(5),
  "& > .MuiTypography-root": {
    fontWeight: 700,
  },
}));

const MainPage: FC = () => {
  const { data, loading, error } = useQueryApp<IMainPage>(MAIN_PAGE_QUERY);

  if (loading)
    return (
      <PageSceleton title={true}>
        <ProductListSceleton />
      </PageSceleton>
    );
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

  // const Slider: FC = () => {
  //   return mainData.topslidervisible ? (
  //     <MainSlider topSlider={mainData.topSlider} baseApiUrl={baseApiUrl} />
  //   ) : null;
  // };

  const bind: IPageBaseProps = {
    name_page: mainData.meta.title,
    action_page: mainData.meta.description,
    meta_key: mainData.meta.keywords,
    link_page: "/",
    meta_full: true,
    canonical_on: true,
    breadcrumbs_on: false,
    //   Slider,
    filter_on: false,
  };

  const bindTopSlider = {
    topSlider: mainData.topSlider,
    topSliderAutoPlay: mainData.topSliderAutoPlay,
    topSliderInterval: mainData.topSliderInterval,
    baseApiUrl,
  };

  return (
    <PageBase {...bind}>
      {mainData.topslidervisible && (
        <MainSlider {...bindTopSlider} />
      )}
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
      {mainData.title && (
        <Typography variant="h5" component="h1" align="center" mt={4} mb={1}>
          {mainData.title}
        </Typography>
      )}
      {mainData.hitData.length > 0 && (
        <CssHitsDiv>
          <Typography variant="h4" component="h2" align="center" mb={3}>
            {mainData.hittitle}
          </Typography>
          <ProductsGrid products={mainData.hitData} />
        </CssHitsDiv>
      )}
      <PageContent content={mainData.content} />
    </PageBase>
  );
};

export default MainPage;
