import React from 'react';
import { useRouter } from '../../hooks/router.hook';
import NewsItemFetch from '../../containers/newsitemfetch/NewsItemFetch';

export default () => {

    const { params } = useRouter();
    const { alias } = params;

    return <NewsItemFetch alias={alias} />
}