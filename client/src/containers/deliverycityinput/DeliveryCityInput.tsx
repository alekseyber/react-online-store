import { useState, useEffect, FC, ChangeEvent } from "react";
import { styled } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete"; //, { createFilterOptions }
import CircularProgress from "@mui/material/CircularProgress";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import InputAdornment from "@mui/material/InputAdornment";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import useDebounce from "../../hooks/use-debounce.hook";
import { cityСurrentVar, ICity } from "../../graphql/localVars";
import {
  DELIVERY_CITY_INPUT_QUERY,
  IDeliveryCityInput,
  IDeliveryCityInputVar,
} from "../../graphql/gqlQuery";
import { useQueryApp } from "../../hooks/appolloQueryApp.hook";

const CssAutocomplete = styled(Autocomplete)(({ theme }) => ({
  maxWidth: 280,
  marginTop: theme.spacing(1),
  marginBottom: theme.spacing(1),
  "& .MuiAutocomplete-inputRoot": {
    paddingRight: `${theme.spacing(0.3)} !important`,
  },
  // listbox: {
  //   maxHeight: "46vh!important",
  // },
}));

interface DeliveryCityInputProps {
  variant?: "filled" | "outlined" | "standard" | undefined;
}

const DeliveryCityInput: FC<DeliveryCityInputProps> = ({
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

  const handleInput = (e: ChangeEvent<{}>, val: string) => {
    if (e) {
      setSearchTerm(val);
    }
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
      renderOption={(props, option) => (
        <Box component="li" {...props} key={String((option as ICity).id)}>
          <div>
            <Typography variant="body1" component="div">
              {(option as ICity).cityName}
            </Typography>
            <Typography variant="body2" component="div" gutterBottom>
              {(option as ICity).oblName}
            </Typography>
          </div>
        </Box>
      )}
      blurOnSelect={true}
      clearOnBlur={true}
      isOptionEqualToValue={(option, value) =>
        (option as ICity).cityName === (value as ICity).cityName
      }
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

export default DeliveryCityInput;
