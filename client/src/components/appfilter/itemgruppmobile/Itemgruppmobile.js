import React from 'react';
import PropTypes from 'prop-types';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { makeStyles } from '@material-ui/core/styles';
import ItemAttr from '../itemattr/ItemAttr';


const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
    },
    heading: {
        fontSize: theme.typography.pxToRem(15),
    },
}));

const ItemGruppMobile = ({ itemGr, colorsData, sizesData, filterSelect }) => {

    const classes = useStyles();
    const [expanded, setExpanded] = React.useState(false);

    const handleChange = () => () => {
        setExpanded(!expanded);
    };



    const aliasGr = itemGr.alias;
    const color = itemGr.color;
    const sizes = itemGr.sizes;

    const itemSelect = filterSelect[aliasGr] ?? {};
    const countSelect = Object.keys(itemSelect).length;
    const selected = countSelect ? ` (${countSelect}) ` : '';

    const attrsCount = itemGr.attrs.length;
    const oneStatus = attrsCount === 1;

    if (!attrsCount) {
        return null
    }

    return (

        <Accordion expanded={expanded} onChange={handleChange()}>
            <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
            >
                <Typography className={classes.heading}>{itemGr.title}{selected}</Typography>
            </AccordionSummary>
            <AccordionDetails>
                <List dense>
                    {itemGr.attrs.map((item, index) => (
                        <ListItem key={index}>
                            <ItemAttr
                                itemAttr={item}
                                aliasGr={aliasGr}
                                color={color}
                                sizes={sizes}
                                colorsData={colorsData}
                                sizesData={sizesData}
                                itemSelect={itemSelect}
                                oneStatus={oneStatus}
                            />
                        </ListItem>
                    ))}
                </List>
            </AccordionDetails>
        </Accordion>

    )
}

ItemGruppMobile.propTypes = {
    itemGr: PropTypes.object.isRequired,
    colorsData: PropTypes.object.isRequired,
    sizesData: PropTypes.object.isRequired,
    filterSelect: PropTypes.object.isRequired,
};

export default ItemGruppMobile;