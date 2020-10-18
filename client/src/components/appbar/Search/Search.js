import React, { useState } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete"; //, { createFilterOptions }
import CircularProgress from "@material-ui/core/CircularProgress";
import SearchIcon from "@material-ui/icons/Search";
import InputAdornment from "@material-ui/core/InputAdornment";
import useDebounce from "../../../hooks/use-debounce.hook";
import { useRouter } from "../../../hooks/router.hook";
import { SEARCH_QUERY } from "../../../graphql/gqlQuery";
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

const Search = ({ fclose }) => {
  const { push } = useRouter();
  const [searchTerm, setSearchTerm] = useState("");

  const q = useDebounce(searchTerm, 500);
  const skip = q.length < 2;

  const { data, loading } = useQueryApp(
    SEARCH_QUERY,
    { q },
    false,
    false,
    "no-cache",
    null,
    skip
  );

  const options = data ? data.searchList : [];

  const handleSelect = (newValue) => {
    // console.log(newValue)
    if (newValue.link) {
      push(newValue.link);
      // setSearchTerm("");
      if (fclose) {
        fclose(false);
      }
    }
  };

  const handleInput = (e) => {
    if (e) {
      e.persist();
      if (e.target.value) {
        setSearchTerm(e.target.value);
      } else {
        setSearchTerm("");
      }
    }
  };

  return (
    <CssAutocomplete
      open={searchTerm.length > 1}
      onChange={(_, newValue) => handleSelect(newValue)}
      getOptionLabel={(option) => option.title}
      //   getOptionSelected={(option, value) => {
      //     return option.title === value.title;
      //   }}
      options={options}
      loading={loading}
      forcePopupIcon={false}
      loadingText="Поиск..."
      noOptionsText="К сожалению ни чего не найдено"
      onInputChange={handleInput}
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

Search.propTypes = {
  fclose: PropTypes.func,
};

export default Search;
