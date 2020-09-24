import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { categoryFetch } from '../../redux/actions/category';
import { setFilterSelectByQwery } from '../../redux/actions/filter';
import LoaderPage from '../../components/loaderpage/LoaderPage';
import Category from '../../containers/category/Category';
import { useQuery, useRouter } from '../../hooks/router.hook';


export default () => {

    const { params } = useRouter();
    const { alias } = params;
    const query = useQuery(true);

    const categoryData = useSelector(state => state.category[alias]);
    const filterData = useSelector(state => state.start.filterData);

    const dispatch = useDispatch();


    useEffect(() => {
        dispatch(categoryFetch(alias));
    }, [dispatch, alias]);

    useEffect(() => {
        if (filterData) {
            dispatch(setFilterSelectByQwery(query));
        }
    }, [dispatch, filterData, query]);

    // console.log(categoryData);

    if (!categoryData) return <LoaderPage />

    return <Category categoryData={categoryData} alias={alias} />

}