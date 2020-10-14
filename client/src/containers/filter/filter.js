import React from "react";
import PropTypes from "prop-types";
import withWidth, { isWidthDown } from "@material-ui/core/withWidth"; //isWidthDown,  isWidthUp
import { useSelector } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import SortBtn from "../../components/sortbtn/SortBtn";
import FilterPanel from "../../components/appfilter/AppFilter";
import { FILTER_QUERY } from "../../graphql/gqlQuery";
import { useQueryApp } from "../../hooks/appolloQueryApp.hook";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    top: theme.spacing(2),
    paddingBottom: theme.spacing(1),
  },
  wrap: {
    justifyContent: "space-between",
  },
}));

const Filter = ({ filterInputRezult, category, width, sortBtnStatus }) => {
  const classes = useStyles();

  const filterSelect = useSelector((state) => state.filter.filterSelect);
  const mobile = isWidthDown("sm", width);
  const elevationValue = mobile ? 3 : 0;
  const btnClear = Object.keys(filterSelect).length > 0;

  const { data } = useQueryApp(FILTER_QUERY);

  if (!data) {
    return null;
  }

  // const filterData = useSelector((state) => state.start.filterData);

  const rootCategory = "/category/" + data.categoryTree.alias;
  const rezult = filterInputRezult
    ? filterInputRezult
    : data.filterData.filterRezult; //

  if (Object.keys(rezult).length === 0) {
    return null;
  }

  return (
    <AppBar
      position="relative"
      color="transparent"
      className={classes.root}
      elevation={elevationValue}
    >
      <Toolbar variant="dense" className={classes.wrap}>
        <div>
          <FilterPanel
            filterRezult={rezult}
            filterSelect={filterSelect}
            category={category}
            rootCategory={rootCategory}
            btnClear={btnClear}
            mobile={mobile}
          />
        </div>
        {sortBtnStatus && <SortBtn />}
      </Toolbar>
    </AppBar>
  );
};

Filter.propTypes = {
  filterInputRezult: PropTypes.oneOfType([
    PropTypes.oneOf([null]),
    PropTypes.array,
  ]),
  category: PropTypes.bool,
  sortBtnStatus: PropTypes.bool,
  // alias: PropTypes.oneOfType([PropTypes.oneOf([null]), PropTypes.string]),
};

Filter.defaultProps = {
  filterInputRezult: null,
  category: false,
  sortBtnStatus: false,
  // alias: null,
};

export default withWidth()(Filter);

//export default Filter;
