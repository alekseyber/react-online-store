import React from 'react';
import { useRouter } from '../../hooks/router.hook';
import { PageBase } from '../../hoc/PageBase';
import Search from '../../containers/search/Search';


export default () => {

    
    const { query } = useRouter();
    const { q } = query;    
    const qStr = q ?? '';
    const title = 'Поиск по запросу: "' + qStr + '"'; 

    const bind = {
        name_page: 'Поиск',
        action_page: title,
        link_page: "/search",
        title,
        filter_on: true,
    }

    return (
        <PageBase {...bind}>
            <Search q={qStr} />
        </PageBase>
    )
}