import { FC } from "react";
import makeStyles from "@mui/styles/makeStyles";
import { Theme, useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import SortBtn from "../../components/sortbtn/SortBtn";
import FilterPanel from "../../components/appfilter/AppFilter";
import { FILTER_QUERY, IFilter, IFilterGrupp } from "../../graphql/gqlQuery";
import { useQueryApp } from "../../hooks/appolloQueryApp.hook";

// FIXME checkout https://mui.com/components/use-media-query/#migrating-from-withwidth
//const withWidth = () => (WrappedComponent) => (props) => <WrappedComponent {...props} width="xs" />;

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    top: theme.spacing(2),
    paddingBottom: theme.spacing(1),
    zIndex: 200,
  },
  wrap: {
    justifyContent: "space-between",
  },
}));

export interface IFilterProps {
  category?: boolean;
  sortBtnStatus?: boolean;
  filterInputRezult?: IFilterGrupp[] | undefined;
}

interface IFilterRezultProps extends IFilterProps {}

const Filter: FC<IFilterRezultProps> = ({
  filterInputRezult,
  category = false,
  sortBtnStatus = false,
}) => {
  const classes = useStyles();
  const theme: Theme = useTheme();

  const mobile = useMediaQuery(theme.breakpoints.down("sm"));

  const elevationValue = mobile ? 3 : 0;

  const { data } = useQueryApp<IFilter>(FILTER_QUERY);

  if (!data) {
    return null;
  }

  const filterSelect = data.filterSelect;
  const btnClear = Object.keys(filterSelect).length > 0;

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

// Filter.propTypes = {
//   filterInputRezult: PropTypes.oneOfType([
//     PropTypes.oneOf([null]),
//     PropTypes.array,
//   ]),
//   category: PropTypes.bool,
//   sortBtnStatus: PropTypes.bool,
//   // alias: PropTypes.oneOfType([PropTypes.oneOf([null]), PropTypes.string]),
// };

// Filter.defaultProps = {
//   filterInputRezult: null,
//   category: false,
//   sortBtnStatus: false,
//   // alias: null,
// };

export default Filter;
