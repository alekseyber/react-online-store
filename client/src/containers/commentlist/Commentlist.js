import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import { useHttp } from '../../hooks/http.hook';
import CommentGrid from '../commentgrid/Commentgrid';
import LoaderContent from '../../components/loadercontent/Loadercontent';




const CommentList = ({ page }) => {

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
                rez.list = await requestNoErrMsgMemo('/api/comment/getall');

            } catch (e) {
                console.error(e);

            } finally {
                setRezult(rez);
            }
        }
        fetchData();

    }, [requestNoErrMsgMemo]);


    return (

        <>
            {(list.length === 0) && <Card>
                <CardContent>
                    {loader && <LoaderContent />}
                    {!loader && (
                        <>
                            <Typography variant="h6" component="h2" align="center" gutterBottom>Отзывов пока нет.</Typography>
                            <Typography variant="body1" component="p" align="center">Отправьте отзыв, использую форму выше.</Typography>
                        </>
                    )}
                </CardContent>
            </Card>}
            {(list.length > 0) && <CommentGrid comments={list} page={page} />}
        </>

    )
}

CommentList.defaultProps = {
    page: 1,
};

CommentList.propTypes = {
    page: PropTypes.number
};


export default CommentList;