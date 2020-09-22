import React, { useState, useMemo, useEffect, useContext, createContext } from 'react';
import PropTypes from 'prop-types';
import Pagination from '@material-ui/lab/Pagination';
import PaginationItem from '@material-ui/lab/PaginationItem';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import { useRouter } from '../hooks/router.hook';
import { usePageBase } from './PageBase';
import { useAddGet } from '../hooks/addget.hook';

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        justifyContent: 'center',
        marginTop: theme.spacing(2),
        '& > *': {
            marginTop: theme.spacing(3),
            marginBottom: theme.spacing(2),
        },
        '& .Mui-selected': {
            backgroundColor: theme.palette.background.dark,
            color: theme.palette.primary.contrastText
        }

    },
}));


const PaginContext = createContext();
export const usePagin = () => useContext(PaginContext);



export const PaginationList = (props) => {
    const classes = useStyles();
    const { replace } = useRouter();
    const link_page = usePageBase();
    const addGet = useAddGet();

    const { children, count_page, input_list, page, spacing_grid } = props;
    const [currentPage, setCurrentPage] = useState(page);

    const handleChange = (event, value) => {
        event.preventDefault();
        setCurrentPage(value);
        if (window.scrollY) {
            window.scrollTo(0, 0);
        }
    };

    useEffect(() => {
        setCurrentPage(1);
    }, [input_list]);


    useEffect(() => {
        setCurrentPage(page);
    }, [page]);

    const totalList = useMemo(() => {
        return input_list.length;
    }, [input_list]);

    const paginationLength = useMemo(() => {
        return Math.ceil(totalList / count_page);
    }, [totalList, count_page]);



    const paginationRezult = useMemo(() => {
        if (totalList === 0) {
            return []
        }
        if (paginationLength === 1) {
            return input_list;
        }

        const start = (currentPage - 1) * count_page;
        const endCanidate = start + count_page;
        const end = endCanidate <= totalList ? endCanidate : totalList;

        return input_list.slice(start, end);

    }, [input_list, totalList, paginationLength, currentPage, count_page]);



    const ItemPagin = ({ item }) => {

        const href = (item.page === 1) ? link_page : addGet(link_page, 'page', item.page);

        return <PaginationItem
            href={href}
            {...item}
        />

    }





    if (paginationLength < page) {
        replace('/404');
    }


    if (totalList === 0) {
        return null;
    }

    return (
        <>
            <Grid
                container
                spacing={spacing_grid}
            >
                <PaginContext.Provider value={paginationRezult}>
                    {children}
                </PaginContext.Provider>
            </Grid>

            {
                paginationLength > 1 && <div className={classes.root}>
                    <Pagination
                        count={paginationLength}
                        variant="outlined"
                        //   shape="rounded" 
                        page={currentPage}
                        onChange={handleChange}
                        color="primary"
                        renderItem={(item) => <ItemPagin item={item} />}
                    />
                </div>
            }
        </>
    );
}

PaginationList.defaultProps = {
    count_page: 8,
    input_list: [],
    page: 1,
    spacing_grid: 2
};

PaginationList.propTypes = {
    children: PropTypes.node.isRequired,
    count_page: PropTypes.number,
    input_list: PropTypes.array,
    page: PropTypes.number,
    spacing_grid: PropTypes.number,

};



