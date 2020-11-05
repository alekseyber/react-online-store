import React, { useState, useEffect } from "react";
//import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete"; //, { createFilterOptions }
import CircularProgress from "@material-ui/core/CircularProgress";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import InputAdornment from "@material-ui/core/InputAdornment";
import Typography from "@material-ui/core/Typography";
import useDebounce from "../../hooks/use-debounce.hook";
import { cityСurrentVar, ICity } from "../../graphql/localVars";
import {
  DELIVERY_CITY_INPUT_QUERY,
  IDeliveryCityInput,
  IDeliveryCityInputVar,
} from "../../graphql/gqlQuery";
import { useQueryApp } from "../../hooks/appolloQueryApp.hook";

const CssAutocomplete = withStyles((theme) => ({
  root: {
    maxWidth: 280,
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
    "& .MuiAutocomplete-inputRoot": {
      paddingRight: `${theme.spacing(0.3)}px !important`,
    },
  },
  listbox: {
    maxHeight: "46vh!important",
  },
}))(Autocomplete);

interface DeliveryCityInputProps {
  variant?: "filled" | "outlined" | "standard" | undefined;
}

const DeliveryCityInput: React.FC<DeliveryCityInputProps> = ({
  variant = "outlined",
}) => {
  const cityСurrent = cityСurrentVar();
  const { cityName } = cityСurrent;

  const [searchTerm, setSearchTerm] = useState(cityName);

  const q = useDebounce(searchTerm, 500);

  const skip = cityName === q;

  const { data, loading } = useQueryApp<
    IDeliveryCityInput,
    IDeliveryCityInputVar
  >(DELIVERY_CITY_INPUT_QUERY, { q }, false, false, "no-cache", null, skip);

  const options = data ? data.citySaerch : [];

  const handleSelect = (newValue: ICity) => {
    cityСurrentVar(newValue);
  };

  const handleInput = (e: React.ChangeEvent<{}>, val: string) => {
    if (e) {
      setSearchTerm(val);
    }
    // if (e) {
    // //  e.persist();
    //   if (val) {
    //     setSearchTerm(val); //e.target.value
    //   } else {
    //     setSearchTerm("");
    //   }
    // }
  };
  const handleClearInput = () => {
    setSearchTerm("");
  };

  useEffect(() => {
    setSearchTerm(cityName);
  }, [cityName]);

  return (
    <CssAutocomplete
      onChange={(_, newValue) => handleSelect(newValue as ICity)}
      getOptionLabel={(option) => (option as ICity).cityName}
      renderOption={(option) => (
        <div>
          <Typography variant="body1" component="div">
            {(option as ICity).cityName}
          </Typography>
          <Typography variant="body2" component="div" gutterBottom>
            {(option as ICity).oblName}
          </Typography>
        </div>
      )}
      blurOnSelect={true}
      clearOnBlur={true}
      getOptionSelected={(option, value) => {
        const opt = option as ICity;
        const valSel = value as ICity;

        return opt.cityName === valSel.cityName;
      }}
      options={options as ICity[]}
      loading={loading}
      forcePopupIcon={false}
      loadingText="Поиск..."
      noOptionsText="К сожалению ни чего не найдено"
      onInputChange={(e, val) => handleInput(e, val)}
      inputValue={searchTerm}
      renderInput={(params) => (
        <TextField
          {...params}
          placeholder="Начните ввод..."
          label="Город"
          variant={variant}
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

// DeliveryCityInput.defaultProps = {
//   variant: "outlined",
// };

// DeliveryCityInput.propTypes = {
//   variant: PropTypes.string,
// };

export default DeliveryCityInput;
