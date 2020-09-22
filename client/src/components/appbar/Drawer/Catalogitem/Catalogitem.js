import React, { useState } from 'react';
import { Link } from "react-router-dom";
import PropTypes from 'prop-types';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Collapse from '@material-ui/core/Collapse';
import { makeStyles } from '@material-ui/core/styles';


const useStyles = makeStyles((theme) => ({
    // root: {

    // },
    nested: {
        paddingLeft: theme.spacing(4),
    },

}));




const CatalogItem = ({ root, item }) => {



    const [gropen, setGrOpen] = useState(false);

    const classes = useStyles();

    const handleListGClick = (e) => {
        e.stopPropagation();
        setGrOpen(!gropen);
    };

    if (root || item.childs.length === 0) {

        return (
            <ListItem button component={Link} to={"/category/" + item.alias}>
                <ListItemText primary={item.title} />
            </ListItem>
        )

    }


    const titleAll = 'Все ' + item.title.toLowerCase();


    return (
        <>
            <ListItem button onClick={handleListGClick}>
                <ListItemText primary={item.title} />
                {gropen ? <ExpandLess /> : <ExpandMore />}
            </ListItem>
            <Collapse in={gropen} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                    <ListItem button className={classes.nested} component={Link} to={"/category/" + item.alias}>
                        <ListItemText primary={titleAll} />
                    </ListItem>
                    {item.childs.map((itemEl, index) => (
                        <ListItem button key={index + 'left'} className={classes.nested} component={Link} to={"/category/" + itemEl.alias}>
                            <ListItemText primary={itemEl.title} />
                        </ListItem>
                    ))}
                </List>
            </Collapse>
        </>
    );
}



CatalogItem.defaultProps = {
    root: false,
};


CatalogItem.propTypes = {
    root: PropTypes.bool,
    item: PropTypes.object.isRequired,
};

export default CatalogItem;
