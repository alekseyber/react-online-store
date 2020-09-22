import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { PaginationList, usePagin } from '../../hoc/Paginationlist';
import CommentItem from '../../components/commentitem/Commentitem';

const CommentGrid = ({ comments, page }) => {

    const count_page_comment = useSelector(state => state.start.paramsData.count_page_comment);
    const count_page = count_page_comment ?? 10;

    const ListComment = () => {
        const paginationRezult = usePagin();

        return (
            <>
                {paginationRezult.map((item, index) => (
                    <CommentItem
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
        input_list: comments,
        spacing_grid: 2
    }


    return (

        <PaginationList {...paginBind}>
            <ListComment />
        </PaginationList>
    )

}

CommentGrid.defaultProps = {
    comments: [],
    page: 1,
};



CommentGrid.propTypes = {
    comments: PropTypes.array,
    page: PropTypes.number,
};

export default CommentGrid;