import { useContext, createContext, useMemo, FC } from "react";
import MetaTags from "react-meta-tags";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Breadcrumbs from "../components/breadcrumbs/Breadcrumbs";
import Filter, { IFilterProps } from "../containers/filter/Filter";
import { useAddGet } from "../hooks/addget.hook";
import {
  PAGE_BASE_QUERY,
  IPageBase,
  TBreadcrumb,
  IFilterGrupp,
} from "../graphql/gqlQuery";
import { useQueryApp } from "../hooks/appolloQueryApp.hook";
import ErrorContent from "../components/errorcontent/ErrorContent";

const useStyles = makeStyles((theme) => ({
  title: {
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(2),
    fontWeight: 700,
  },
}));

export interface IPageBaseProps {
  name_page?: string;
  action_page?: string;
  link_page?: string;
  title?: string;
  filter_on?: boolean;
  meta_full?: boolean;
  breadcrumbs_data?: TBreadcrumb[];
  meta_key?: string;
  breadcrumbs_name?: string;
  filterInputRezult?: IFilterGrupp[];
  canonical_on?: boolean;
  breadcrumbs_add?: boolean;
  page?: number;
  container_fixed?: boolean;
  breadcrumbs_on?: boolean;
  error?: boolean;
  category?: boolean;
  Slider?: FC | null;
}

// declare namespace JSX {
// export interface IPageBaseElementAttributesProperty extends IPageBaseProps {}
// }

const PageBaseContext = createContext<string>("/");
export const usePageBase = () => useContext(PageBaseContext);

export const PageBase: FC<IPageBaseProps> = (props) => {
  const classes = useStyles();
  const addGet = useAddGet();

  const {
    children,
    name_page = "",
    action_page = "",
    link_page = "/",
    title,
    filter_on = true,
    meta_full = false,
    breadcrumbs_data = [],
    meta_key,
    breadcrumbs_name,
    canonical_on = false,
    breadcrumbs_add = true,
    breadcrumbs_on = true,
    page = 1,
    filterInputRezult,
    container_fixed = false,
    error = false,
    category = false,
    Slider = null,
  } = props;

  const { data } = useQueryApp<IPageBase>(PAGE_BASE_QUERY);

  const shop_name = useMemo(() => {
    if (data) {
      return data.paramsData.shop_name;
    }
    return "";
  }, [data]);

  const pageTitle = !meta_full
    ? `Интернет-магазин ${shop_name} - ${name_page}`
    : name_page;
  const pageDescr = !meta_full
    ? `${action_page} в интернет-магазине ${shop_name}`
    : action_page;
  const pageKeywords = !meta_key
    ? `${action_page}, ${name_page}, ${shop_name}`
    : meta_key;

  const breadcrumbs = [...breadcrumbs_data];

  const pagePosfix = page > 1 ? ` - Страница ${page}` : "";

  if (breadcrumbs_add && breadcrumbs_on) {
    breadcrumbs.push({
      disabled: true,
      text: breadcrumbs_name || name_page,
      href: link_page,
      level: breadcrumbs.length + 2,
    });
  }

  const bindFilter: IFilterProps = {
    sortBtnStatus: false,
  };

  if (filter_on) {
    bindFilter.sortBtnStatus = true;
    bindFilter.category = category;
    bindFilter.filterInputRezult = filterInputRezult;
  }
  let canonical = link_page;

  if (canonical_on && page > 1) {
    canonical = addGet(canonical, "page", page.toString(), false);
  }

  //<meta property="og:image" content="path/to/image.jpg" />

  return (
    <>
      {!error && (
        <MetaTags>
          <title>{pageTitle + pagePosfix}</title>
          <meta name="description" content={pageDescr + pagePosfix} />
          <meta property="og:title" content={pageTitle + pagePosfix} />
          <meta name="keywords" content={pageKeywords} />
          {canonical_on && !error && <link rel="canonical" href={canonical} />}
        </MetaTags>
      )}
      {Slider && <Slider />}
      <Container fixed={container_fixed}>
        {filter_on && !error && <Filter {...bindFilter} />}
        {title && !error && (
          <Typography
            variant="h5"
            component="h1"
            align="center"
            className={classes.title}
          >
            {title + pagePosfix}
          </Typography>
        )}
        {breadcrumbs_on && !error && (
          <Breadcrumbs breadcrumbsData={breadcrumbs} />
        )}
        <PageBaseContext.Provider value={link_page}>
          {!error ? children : <ErrorContent />}
        </PageBaseContext.Provider>
      </Container>
    </>
  );
};

// PageBase.defaultProps = {
//   filter_on: true,
//   meta_full: false,
//   breadcrumbs_data: [],
//   canonical_on: false,
//   breadcrumbs_add: true,
//   page: 1,
//   container_fixed: true,
//   breadcrumbs_on: true,
//   name_page: "",
//   action_page: "",
//   link_page: "/",
//   error: false,
//   filterInputRezult: [],
// };

// PageBase.propTypes = {
//   children: PropTypes.node,
//   name_page: PropTypes.string,
//   action_page: PropTypes.string,
//   link_page: PropTypes.string,
//   title: PropTypes.string,
//   filter_on: PropTypes.bool,
//   meta_full: PropTypes.bool,
//   breadcrumbs_data: PropTypes.array,
//   meta_key: PropTypes.string,
//   breadcrumbs_name: PropTypes.string,
//   filterInputRezult: PropTypes.array,
//   canonical_on: PropTypes.bool,
//   breadcrumbs_add: PropTypes.bool,
//   page: PropTypes.number,
//   container_fixed: PropTypes.bool,
//   breadcrumbs_on: PropTypes.bool,
//   error: PropTypes.bool,
// };

//export default PageBase;
