import React, {
  useState,
  useMemo,
  useEffect,
  useContext,
  createContext,
} from "react";
import PropTypes from "prop-types";
import Pagination from "@material-ui/lab/Pagination";
import PaginationItem from "@material-ui/lab/PaginationItem";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";
import { useRouter } from "../hooks/router.hook";
import { usePageBase } from "./PageBase";
import { useAddGet } from "../hooks/addget.hook";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    justifyContent: "center",
    marginTop: theme.spacing(2),
    "& > *": {
      marginTop: theme.spacing(3),
      marginBottom: theme.spacing(2),
    },
    "& .Mui-selected": {
      backgroundColor: theme.palette.background.dark,
      color: theme.palette.primary.contrastText,
    },
  },
}));

const PaginContext = createContext();
export const usePagin = () => useContext(PaginContext);

export const PaginationList = (props) => {
  const classes = useStyles();
  const { replace } = useRouter();
  const linkPage = usePageBase();
  const addGet = useAddGet();

  const { children, countPage, inputList, page, spacingGrid } = props;
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
  }, [inputList]);

  useEffect(() => {
    setCurrentPage(page);
  }, [page]);

  const totalList = useMemo(() => {
    return inputList.length;
  }, [inputList]);

  const paginationLength = useMemo(() => {
    return Math.ceil(totalList / countPage);
  }, [totalList, countPage]);

  const paginationRezult = useMemo(() => {
    if (totalList === 0) {
      return [];
    }
    if (paginationLength === 1) {
      return inputList;
    }

    const start = (currentPage - 1) * countPage;
    const endCanidate = start + countPage;
    const end = endCanidate <= totalList ? endCanidate : totalList;

    return inputList.slice(start, end);
  }, [inputList, totalList, paginationLength, currentPage, countPage]);

  const ItemPagin = ({ item }) => {
    const href =
      item.page === 1 ? linkPage : addGet(linkPage, "page", item.page);

    return <PaginationItem href={href} {...item} />;
  };

  if (paginationLength < page) {
    replace("/404");
  }

  if (totalList === 0) {
    return null;
  }

  return (
    <>
      <Grid container spacing={spacingGrid}>
        <PaginContext.Provider value={paginationRezult}>
          {children}
        </PaginContext.Provider>
      </Grid>

      {paginationLength > 1 && (
        <div className={classes.root}>
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
      )}
    </>
  );
};

PaginationList.defaultProps = {
  countPage: 8,
  inputList: [],
  page: 1,
  spacingGrid: 2,
};

PaginationList.propTypes = {
  children: PropTypes.node.isRequired,
  countPage: PropTypes.number,
  inputList: PropTypes.array,
  page: PropTypes.number,
  spacingGrid: PropTypes.number,
};
