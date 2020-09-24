import React, { useContext, createContext } from 'react';
import PropTypes from 'prop-types';
import MetaTags from 'react-meta-tags';
import { useSelector } from 'react-redux';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Breadcrumbs from '../components/breadcrumbs/Breadcrumbs';
import Filter from '../containers/filter/Filter';
import { useAddGet } from '../hooks/addget.hook';


const useStyles = makeStyles((theme) => ({

    title: {
        marginTop: theme.spacing(4),
        marginBottom: theme.spacing(2),
        fontWeight: 700
    },
}));

const PageBaseContext = createContext();
export const usePageBase = () => useContext(PageBaseContext);

export const PageBase = (props) => {
    const classes = useStyles();
    const addGet = useAddGet();
    const {
        children,
        name_page,
        action_page,
        link_page,
        title,
        filter_on,
        meta_full,
        breadcrumbs_data,
        meta_key,
        breadcrumbs_name,
        canonical_on,
        breadcrumbs_add,
        breadcrumbs_on,
        page,
        filterInputRezult,
        container_fixed
    } = props;

    const { shop_name } = useSelector(state => state.start.paramsData);
    const pageTitle = !meta_full ? `Интернет-магазин ${shop_name} - ${name_page}` : name_page;
    const pageDescr = !meta_full ? `${action_page} в интернет-магазине ${shop_name}` : action_page;
    const pageKeywords = !meta_key ? `${action_page}, ${name_page}, ${shop_name}` : meta_key;

    const breadcrumbs = [...breadcrumbs_data];

    const pagePosfix = (page > 1) ? ` - Страница ${page}` : '';

    if (breadcrumbs_add && breadcrumbs_on) {
        breadcrumbs.push({
            disabled: true,
            text: breadcrumbs_name ?? name_page,
            href: link_page
        });
    }

    const bindFilter = {
        sortBtnStatus: false
    }

    if (filterInputRezult && filter_on) {
        bindFilter.sortBtnStatus = true;
        bindFilter.category = true;
        bindFilter.filterInputRezult = filterInputRezult;
    }
    let canonical = link_page;

    if (canonical_on && page > 1) {
        canonical = addGet(canonical, 'page', page, false);
    }

    //<meta property="og:image" content="path/to/image.jpg" /> 

    return (
        <>
            <MetaTags>
                <title>{pageTitle + pagePosfix}</title>
                <meta name="description" content={pageDescr + pagePosfix} />
                <meta property="og:title" content={pageTitle + pagePosfix} />
                <meta name="keywords" content={pageKeywords} />
                {canonical_on && <link rel="canonical" href={canonical} />}
            </MetaTags>
            <Container fixed={container_fixed}>
                {filter_on && <Filter {...bindFilter} />}
                {title && <Typography variant="h5" component="h1" align="center" className={classes.title}>{title + pagePosfix}</Typography>}
                {breadcrumbs_on && <Breadcrumbs breadcrumbsData={breadcrumbs} />}
                <PageBaseContext.Provider value={link_page}>
                    {children}
                </PageBaseContext.Provider>
            </Container>
        </>
    );
}

PageBase.defaultProps = {
    filter_on: true,
    meta_full: false,
    breadcrumbs_data: [],
    canonical_on: false,
    breadcrumbs_add: true,
    page: 1,
    container_fixed: true,
    breadcrumbs_on: true
};




PageBase.propTypes = {
    children: PropTypes.node.isRequired,
    name_page: PropTypes.string.isRequired,
    action_page: PropTypes.string.isRequired,
    link_page: PropTypes.string.isRequired,
    title: PropTypes.string,
    filter_on: PropTypes.bool,
    meta_full: PropTypes.bool,
    breadcrumbs_data: PropTypes.array,
    meta_key: PropTypes.string,
    breadcrumbs_name: PropTypes.string,
    filterInputRezult: PropTypes.array,
    canonical_on: PropTypes.bool,
    breadcrumbs_add: PropTypes.bool,
    page: PropTypes.number,
    container_fixed: PropTypes.bool,
    breadcrumbs_on: PropTypes.bool,
};


//export default PageBase;
