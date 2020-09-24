import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import { useHttp } from '../../hooks/http.hook';
import NewsGrid from '../newsgrid/NewsGrid';
import LoaderContent from '../../components/loadercontent/LoaderContent';





const NewsList = ({ page }) => {

    const dispatch = useDispatch();
    const { requestNoErrMsg } = useHttp(dispatch);
    const requestNoErrMsgMemo = useCallback(requestNoErrMsg, []);

    const initial = {
        loader: true,
        list: [],
    }
    const [rezult, setRezult] = useState(initial);

    const { loader, list } = rezult;

    useEffect(() => {

        const fetchData = async () => {

            const rez = {
                loader: false,
                list: [],
            }
            try {
                rez.list = await requestNoErrMsgMemo('/api/news/getall');

            } catch (e) {
                console.error(e);

            } finally {
                setRezult(rez);
            }
        }
        fetchData();


    }, [requestNoErrMsgMemo]);

    // eslint-disable-next-line

    return (

        <>
            {(list.length === 0) && <Card>
                <CardContent>
                    {loader && <LoaderContent />}
                    {!loader && (
                        <>
                            <Typography variant="h6" component="h2" align="center" gutterBottom>Новостей пока нет.</Typography>
                        </>
                    )}
                </CardContent>
            </Card>}
            {(list.length > 0) && <NewsGrid news={list} page={page} />}
        </>

    )
}

NewsList.defaultProps = {
    page: 1
};

NewsList.propTypes = {
    page: PropTypes.number
};


export default NewsList;