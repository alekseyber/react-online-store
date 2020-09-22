import React from 'react';
import { PageBase } from '../../hoc/PageBase';
import NewsList from '../../containers/newslist/Newslist';
import { useGetQueryPage } from '../../hooks/router.hook';

export default () => {

    const page = useGetQueryPage();

    const bind = {
        name_page: 'Новости, блог',
        action_page: 'Новости, блог',
        link_page: "/Новости, блог",
        title: 'Новости, блог',
        filter_on: true,
        page,
        canonical_on: true,
    }

    return (
        <PageBase {...bind}>
            <NewsList page={page} />
        </PageBase>
    )
}