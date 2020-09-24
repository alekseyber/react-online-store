import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { useHttp } from '../../hooks/http.hook';
import LoaderContent from '../../components/loadercontent/LoaderContent';
import { PageBase } from '../../hoc/PageBase';
import PageContent from '../../components/pagecontent/PageContent';




const NewsItemFetch = ({ alias }) => {

    const dispatch = useDispatch();
    const { requestRedirect } = useHttp(dispatch);

    const requestRedirectMemo = useCallback(requestRedirect, []);

    const initial = {
        loader: true,
        content: null,
    }
    const [rezult, setRezult] = useState(initial);

    const { loader, content } = rezult;

    useEffect(() => {
        setRezult({
            loader: true,
            content: null
        });

    }, [alias]);

    useEffect(() => {

        const fetchData = async () => {

            const rez = {
                loader: false,
                content: null,
            }
            try {
                rez.content = await requestRedirectMemo(`/api/news/${alias}`);

            } catch (e) {
                console.error(e);

            } finally {
                setRezult(rez);
            }
        }
        fetchData();

       
    }, [alias, requestRedirectMemo]);

 // eslint-disable-next-line

    if (loader) {
        return (
            <Card>
                <CardContent>
                    <LoaderContent />
                </CardContent>
            </Card>
        )
    }

    if (!content) {
        return null
    }


    const bind = {
        name_page: content.meta_title,
        action_page: content.meta_description,
        link_page: "/news/" + alias,
        title: content.title,
        filter_on: true,
        meta_full: true,
        meta_key: content.meta_keywords,
        breadcrumbs_name: content.title
    }

    return (
        <PageBase {...bind}>
            <PageContent content={content.content} />
        </PageBase>
    )
}


NewsItemFetch.propTypes = {
    alias: PropTypes.string.isRequired,
};

export default NewsItemFetch;