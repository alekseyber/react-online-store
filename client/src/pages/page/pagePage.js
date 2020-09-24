import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { pageFetch } from '../../redux/actions/page';
import LoaderPage from '../../components/loaderpage/LoaderPage';
import { useRouter } from '../../hooks/router.hook';
import { PageBase } from '../../hoc/PageBase';
import PageContent from '../../components/pagecontent/PageContent';


export default () => {

    const { params } = useRouter();
    const { alias } = params;

    const pageData = useSelector(state => state.page.pageContent[alias]);
    const dispatch = useDispatch();


    useEffect(() => {
        dispatch(pageFetch(alias));
    }, [dispatch, alias]);

    if (!pageData) return <LoaderPage />

    const bind = {
        name_page: pageData.meta_title,
        action_page: pageData.meta_description,
        link_page: "/page/" + alias,
        title: pageData.title,
        filter_on: true,
        meta_full: true,
        meta_key: pageData.meta_keywords,
        breadcrumbs_name: pageData.title
    }

    return (
        <PageBase {...bind}>
            <PageContent content={pageData.content} />
        </PageBase>
    )
}