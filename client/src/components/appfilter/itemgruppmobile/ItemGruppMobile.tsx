import { FC, useState } from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import makeStyles from '@mui/styles/makeStyles';
import ItemAttr from "../itemattr/ItemAttr";
import { ItemGruppProps } from "../AppFilter";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
  },
}));

const ItemGruppMobile: FC<ItemGruppProps> = ({ itemGr, filterSelect }) => {
  const classes = useStyles();
  const [expanded, setExpanded] = useState(false);

  const handleChange = () => () => {
    setExpanded(!expanded);
  };

  const aliasGr = itemGr.alias;
  const color = itemGr.color;
  const sizes = itemGr.sizes;

  const itemSelect = filterSelect[aliasGr] ?? {};
  const countSelect = Object.keys(itemSelect).length;
  const selected = countSelect ? ` (${countSelect}) ` : "";

  const attrsCount = itemGr.attrs.length;
  const oneStatus = attrsCount === 1;

  if (!attrsCount) {
    return null;
  }

  return (
    <Accordion expanded={expanded} onChange={handleChange()}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography className={classes.heading}>
          {itemGr.title}
          {selected}
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        <List dense>
          {itemGr.attrs.map((item, index: number) => (
            <ListItem key={index}>
              <ItemAttr
                itemAttr={item}
                aliasGr={aliasGr}
                color={color}
                sizes={sizes}
                itemSelect={itemSelect}
                oneStatus={oneStatus}
              />
            </ListItem>
          ))}
        </List>
      </AccordionDetails>
    </Accordion>
  );
};

// ItemGruppMobile.propTypes = {
//   itemGr: PropTypes.object.isRequired,
//   // colorsData: PropTypes.object.isRequired,
//   //  sizesData: PropTypes.object.isRequired,
//   filterSelect: PropTypes.object.isRequired,
// };

export default ItemGruppMobile;
