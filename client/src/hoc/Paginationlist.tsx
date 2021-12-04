import {
  useState,
  useMemo,
  useEffect,
  useContext,
  createContext,
  FC,
  ChangeEvent,
  ReactNode,
} from "react";
import { useNavigate } from "react-router-dom";
import Pagination, {
  PaginationRenderItemParams,
} from "@mui/material/Pagination";
import PaginationItem from "@mui/material/PaginationItem";
import Grid, { GridSpacing } from "@mui/material/Grid";
import { styled } from "@mui/material/styles";
import { usePageBase } from "./PageBase";
import { useAddGet } from "../hooks/addget.hook";

const CssRootDiv = styled("div")(({ theme }) => ({
  display: "flex",
  justifyContent: "center",
  marginTop: theme.spacing(2),
  "& > *": {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(2),
  },
  "& .Mui-selected": {
    backgroundColor: `${theme.palette.darkprimary.main}!important`,
    color: `${theme.palette.primary.contrastText}!important`,
    "&:hover": {
      cursor: "default!important",
    },
  },
}));

const PaginContext = createContext<any[]>([]);
export const usePagin = () => useContext(PaginContext);

export interface PaginationListProps<T> {
  inputList: T[];
  children: ReactNode;
  countPage?: number;
  page?: number;
  spacingGrid?: GridSpacing | undefined;
}

interface ItemPaginProps {
  item: PaginationRenderItemParams;
}

export function PaginationList<T>(props: PaginationListProps<T>) {
  let navigate = useNavigate();
  const linkPage = usePageBase();
  const addGet = useAddGet();

  const {
    children,
    countPage = 8,
    inputList = [],
    page = 1,
    spacingGrid = 2,
  } = props;
  const [currentPage, setCurrentPage] = useState(page);

  const handleChange = (event: ChangeEvent<unknown>, value: number) => {
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

  const totalList: number = useMemo(() => {
    return inputList.length;
  }, [inputList]);

  const paginationLength: number = useMemo(() => {
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

  const ItemPagin: FC<ItemPaginProps> = ({ item }) => {
    let href = linkPage;
    if (item) {
      if (item.page && item.page > 1) {
        href = addGet(linkPage, "page", item.page.toString());
      }
    }

    return <PaginationItem component="a" href={href} {...item} />;
  };

  useEffect(() => {
    if (paginationLength < page) {
      navigate("/404", { replace: true });
    }
  }, [paginationLength, page, navigate]);

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
        <CssRootDiv>
          <Pagination
            count={paginationLength}
            variant="outlined"
            shape="circular"
            page={currentPage}
            onChange={handleChange}
            color="primary"
            renderItem={(item) => <ItemPagin item={item} />}
          />
        </CssRootDiv>
      )}
    </>
  );
}
