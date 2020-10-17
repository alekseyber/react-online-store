import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete"; //, { createFilterOptions }
import CircularProgress from "@material-ui/core/CircularProgress";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import InputAdornment from "@material-ui/core/InputAdornment";
import Typography from "@material-ui/core/Typography";
import axios from "../../axios/axios-store";
import useDebounce from "../../hooks/use-debounce.hook";
import { cityСurrentVar } from "../../graphql/localVars";

const CssAutocomplete = withStyles((theme) => ({
  root: {
    maxWidth: 280,
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
    // '& .MuiInputBase-root': {
    //    // paddingRight: "22px!important",
    // },
    "& .MuiAutocomplete-inputRoot": {
      // padding: "3px 5px !important ",
      paddingRight: `${theme.spacing(0.3)}px !important`,
    },
  },
  listbox: {
    maxHeight: "46vh!important",    
  },
}))(Autocomplete);

const DeliveryCityInput = ({ variant }) => {
  const [open, setOpen] = useState(false);

  const cityСurrent = cityСurrentVar();
  const { cityName } = cityСurrent;

  const [searchTerm, setSearchTerm] = useState(cityName);
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const handleSelect = (newValue) => {
    cityСurrentVar(newValue);
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
  const handleClearInput = () => {
    setSearchTerm("");
  };

  useEffect(() => {
    setSearchTerm(cityName);
  }, [cityName]);

  useEffect(() => {
    if (debouncedSearchTerm < 3 || cityName === debouncedSearchTerm) {
      if (cityName === debouncedSearchTerm) {
        setOpen(false);
      } else {
        setOptions([]);
      }

      return undefined;
    }

    (async () => {
      try {
        setLoading(true);
        setOpen(true);

        const { data } = await axios(`/api/delivery/getcity`, {
          params: { citySaerch: debouncedSearchTerm },
        });

        if (data.length > 0) {
          setOptions(data);
        } else {
          setOptions([]);
        }
      } catch (e) {
        // console.error(e)
      } finally {
        setLoading(false);
      }
    })();

    return () => {
      setOptions([]);
    };
  }, [debouncedSearchTerm, cityName]);

  return (
    <CssAutocomplete
      open={open}
      onChange={(e, newValue) => handleSelect(newValue)}
      onClose={() => {
        setOpen(false);
      }}
      getOptionLabel={(option) => option.cityName}
      renderOption={(option) => (
        <div>
          <Typography variant="body1" component="div">
            {option.cityName}
          </Typography>
          <Typography variant="body2" component="div" gutterBottom>
            {option.oblName}
          </Typography>
        </div>
      )}
      getOptionSelected={(option, value) => {
        return option.cityName === value.cityName;
      }}
      options={options}
      loading={loading}
      forcePopupIcon={false}
      loadingText="Поиск..."
      noOptionsText="К сожалению ни чего не найдено"
      onInputChange={handleInput}
      inputValue={searchTerm}
      // filterOptions={(options, params) => {
      //     const rezult = options;
      //     if (params.inputValue !== '') {
      //         return rezult;
      //     }

      //     return [];
      // }}
      renderInput={(params) => (
        <TextField
          {...params}
          placeholder="Начните ввод..."
          label="Город"
          //defaultValue={cityName}
          variant={variant}
          //  autoComplete="off"
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {loading ? (
                  <CircularProgress color="inherit" size={20} />
                ) : null}
                <InputAdornment position="end">
                  <IconButton
                    size="small"
                    onClick={handleClearInput}
                    disabled={searchTerm.length === 0}
                    className="mr-1"
                  >
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </InputAdornment>
              </>
            ),
          }}
        />
      )}
    />
  );
};

DeliveryCityInput.defaultProps = {
  variant: "outlined",
};

DeliveryCityInput.propTypes = {
  variant: PropTypes.string,
};

export default DeliveryCityInput;
