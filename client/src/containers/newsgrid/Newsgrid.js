import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { PaginationList, usePagin } from '../../hoc/Paginationlist';
import NewsItem from '../../components/newsitem/Newsitem';

const NewsGrid = ({ news, page }) => {

    const count_page_news = useSelector(state => state.start.paramsData.count_page_news);
    const count_page = count_page_news ?? 10;

    const ListNews = () => {
        const paginationRezult = usePagin();        

        return (
            <>
                {paginationRezult.map((item, index) => (
                    <NewsItem
                        item={item}
                        key={index}
                    />
                ))
                }
            </>
        )
    }


    const paginBind = {
        count_page,
        page,
        input_list: news,
        spacing_grid: 3
    }


    return (

        <PaginationList {...paginBind}>
            <ListNews />
        </PaginationList>
    )

}

NewsGrid.defaultProps = {
    news: [],
    page: 1,
};



NewsGrid.propTypes = {
    news: PropTypes.array,
    page: PropTypes.number,
};

export default NewsGrid;