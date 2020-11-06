import React, { useState } from "react";
import { Link } from "react-router-dom";
//import PropTypes from "prop-types";
import Button from "@material-ui/core/Button";
import Drawer from "@material-ui/core/Drawer";
import { makeStyles } from "@material-ui/core/styles";
import ItemGrupp from "./itemgrupp/ItemGrupp";
import ItemGruppMbile from "./itemgruppmobile/ItemGruppMobile";
import {
  removeFilterSelect,
  IFilterSelectGr,
} from "../../graphql/localVarsFilter";
import { IFilterGrupp } from "../../graphql/gqlQuery";

const useStyles = makeStyles((theme) => ({
  btngr: {
    marginRight: theme.spacing(1),
    fontSize: theme.typography.pxToRem(11),
  },
}));

interface AppFilterProps {
  category: boolean;
  btnClear: boolean;
  mobile: boolean;
  rootCategory: string;
  filterRezult: IFilterGrupp[];
  filterSelect: IFilterSelectGr;
}

export interface ItemGruppProps {
  itemGr: IFilterGrupp;
  filterSelect: IFilterSelectGr;
}

const AppFilter: React.FC<AppFilterProps> = ({
  filterRezult,
  filterSelect,
  category,
  rootCategory,
  btnClear,
  mobile,
}) => {
  const classes = useStyles();

  const [state, setState] = useState(false);

  const toggleDrawer = (open: boolean) => (
    event: React.TouchEvent | React.KeyboardEvent | React.MouseEvent
  ): void => {
    if (
      event.type === "keydown" &&
      ((event as React.KeyboardEvent).key === "Tab" ||
        (event as React.KeyboardEvent).key === "Shift")
    ) {
      return;
    }

    setState(open);
  };

  const handleClear = () => {
    removeFilterSelect();
  };

  return (
    <>
      {mobile && (
        <Button
          variant="contained"
          color="primary"
          onClick={toggleDrawer(true)}
          className={classes.btngr}
          // size="small"
        >
          Фильтр
        </Button>
      )}
      {btnClear && category && (
        <Button
          variant="outlined"
          color="primary"
          onClick={handleClear}
          className={classes.btngr}
          //  size="small"
        >
          Очистить
        </Button>
      )}
      {btnClear && !category && (
        <Button
          variant="outlined"
          color="primary"
          className={classes.btngr}
       //   size="small"
          component={Link}
          to={rootCategory}
        >
          Результат
        </Button>
      )}
      {!mobile &&
        filterRezult.map((item, index) => (
          <ItemGrupp key={index} itemGr={item} filterSelect={filterSelect} />
        ))}
      {mobile && (
        <Drawer anchor="bottom" open={state} onClose={toggleDrawer(false)}>
          {filterRezult.map((item, index) => (
            <ItemGruppMbile
              key={index}
              itemGr={item}
              filterSelect={filterSelect}
            />
          ))}
        </Drawer>
      )}
    </>
  );
};

export default AppFilter;

// AppFilter.propTypes = {
//   filterRezult: PropTypes.array.isRequired,
//   filterSelect: PropTypes.object.isRequired,
//   category: PropTypes.bool.isRequired,
//   rootCategory: PropTypes.string.isRequired,
//   btnClear: PropTypes.bool.isRequired,
//   mobile: PropTypes.bool.isRequired,
// };
