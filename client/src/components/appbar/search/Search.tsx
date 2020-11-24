import { useState, FC, ChangeEvent } from "react";
import { withStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete"; //, { createFilterOptions }
import CircularProgress from "@material-ui/core/CircularProgress";
import SearchIcon from "@material-ui/icons/Search";
import InputAdornment from "@material-ui/core/InputAdornment";
import useDebounce from "../../../hooks/use-debounce.hook";
import { useRouter } from "../../../hooks/router.hook";
import {
  SEARCH_QUERY,
  ISearch,
  ISearchVar,
  TSearchProductsList,
} from "../../../graphql/gqlQuery";
import { useQueryApp } from "../../../hooks/appolloQueryApp.hook";

const CssTextField = withStyles({
  root: {
    boxShadow:
      "0 3px 1px -2px rgba(0,0,0,.2), 0 2px 2px 0 rgba(0,0,0,.14), 0 1px 5px 0 rgba(0,0,0,.12)",
    borderColor: "transparent",

    "& label.Mui-focused": {
      color: "transparent",
    },
    "& .MuiInput-underline:after": {
      borderBottomColor: "transparent",
    },
    "& .MuiOutlinedInput-root": {
      "& fieldset": {
        borderColor: "transparent",
      },
      "&:hover fieldset": {
        borderColor: "transparent",
      },
      "&.Mui-focused fieldset": {
        borderColor: "transparent",
      },
    },
  },
})(TextField);

const CssAutocomplete = withStyles({
  root: {
    maxWidth: 260,
    margin: "0 auto",
    "& .MuiInputBase-root": {
      paddingRight: "22px!important",
    },
    "& .MuiAutocomplete-inputRoot": {
      padding: "3px!important",
    },
  },
  listbox: {
    maxHeight: "46vh!important",
    "& li:last-child": {
      fontWeight: 700,
    },
  },
})(Autocomplete);

interface SearchProps {
  fclose?: () => void;
}

const Search: FC<SearchProps> = ({ fclose }) => {
  const { push } = useRouter();
  const [searchTerm, setSearchTerm] = useState("");

  const q = useDebounce(searchTerm, 500);
  const skip: boolean = q.length < 2 && searchTerm.length === 0;

  const { data, loading } = useQueryApp<ISearch, ISearchVar>(
    SEARCH_QUERY,
    { q },
    false,
    false,
    "no-cache",
    null,
    skip
  );

  const options: TSearchProductsList[] = data ? data.searchList : [];

  const handleSelect = (newValue: TSearchProductsList) => {
    if (newValue) {
      if (newValue.link) {
        // setSearchTerm("");
        push(newValue.link);

        if (fclose) {
          fclose();
        }
      }
    }
  };

  const handleInput = (e: ChangeEvent<{}>, value: string) => {
    // setSearchTerm(value);

    if (e) {
      setSearchTerm(value);
      //  // e.persist();
      //   if (value) {
      //     setSearchTerm(value); //e.target.value
      //   } else {
      //     setSearchTerm("");
      //   }
    } else {
      setSearchTerm("");
    }
  };

  return (
    <CssAutocomplete
      open={searchTerm.length > 1}
      onChange={(_, newValue) => handleSelect(newValue as TSearchProductsList)}
      getOptionLabel={(option) => (option as TSearchProductsList).title}
      getOptionSelected={() => {
        //option, value
        // const opt = option as TSearchProductsList;
        // const valSel = value as TSearchProductsList;

        // console.log(opt, valSel);
        // return opt.title === valSel.title;
        return true;
      }}
      options={options}
      loading={loading}
      blurOnSelect={true}
      clearOnBlur={true}
      forcePopupIcon={false}
      loadingText="Поиск..."
      noOptionsText="К сожалению ни чего не найдено"
      onInputChange={(e, value) => handleInput(e, value)}
      inputValue={searchTerm}
      filterOptions={(options, params) => {
        const rezult = options;
        if (params.inputValue !== "") {
          return rezult;
        }

        return [];
      }}
      renderInput={(params) => (
        <CssTextField
          {...params}
          placeholder="Поиск…"
          variant="outlined"
          //  autoComplete="off"
          // onChange={e => setSearchTerm(e.target.value)}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {loading ? (
                  <CircularProgress color="inherit" size={20} />
                ) : null}
                <InputAdornment position="end">
                  <SearchIcon />
                </InputAdornment>
              </>
            ),
          }}
        />
      )}
    />
  );
};

export default Search;
