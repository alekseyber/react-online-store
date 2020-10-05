
import axios from '../../../axios/axios-store';
import React, { useState, useEffect } from 'react'; //, { useCallback }
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete'; //, { createFilterOptions }
import CircularProgress from '@material-ui/core/CircularProgress';
import SearchIcon from '@material-ui/icons/Search';
import InputAdornment from '@material-ui/core/InputAdornment';
import useDebounce from '../../../hooks/use-debounce.hook';
import { useRouter } from '../../../hooks/router.hook';

// function sleep(delay = 0) {
//     return new Promise((resolve) => {
//         setTimeout(resolve, delay);
//     });
// }
//const filter = createFilterOptions();


const CssTextField = withStyles({
    root: {
        boxShadow: "0 3px 1px -2px rgba(0,0,0,.2), 0 2px 2px 0 rgba(0,0,0,.14), 0 1px 5px 0 rgba(0,0,0,.12)",
        borderColor: 'transparent',

        '& label.Mui-focused': {
            color: 'transparent',
        },
        '& .MuiInput-underline:after': {
            borderBottomColor: 'transparent',
        },
        '& .MuiOutlinedInput-root': {
            '& fieldset': {
                borderColor: 'transparent',
            },
            '&:hover fieldset': {
                borderColor: 'transparent',
            },
            '&.Mui-focused fieldset': {
                borderColor: 'transparent',
            },
        },
    },
})(TextField);


const CssAutocomplete = withStyles({
    root: {
        maxWidth: 260,
        margin: "0 auto",
        '& .MuiInputBase-root': {
            paddingRight: "22px!important",
        },
        '& .MuiAutocomplete-inputRoot': {
            padding: "3px!important",
        },
    },
    listbox: {
        maxHeight: "46vh!important",
        "& li:last-child": {
            fontWeight: 700
        }

    }
})(Autocomplete);

const Search = ({ fclose }) => {
    // const history = useHistory();
    const { push } = useRouter();
    const [open, setOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [options, setOptions] = useState([]);
    const [loading, setLoading] = useState(false);


    const debouncedSearchTerm = useDebounce(searchTerm, 500);

    const handleSelect = (e, newValue) => {

        if (newValue.link === null) {
            return undefined
        }
        if (newValue.link) {
            push(newValue.link);

            if (fclose) {
                fclose(false)
            }
        }
        setOpen(false);

    }

    const handleInput = (e) => {
        if (e) {
            e.persist();
            if (e.target.value) {
                setSearchTerm(e.target.value);
            } else {
                setSearchTerm('')
            }
        }
    }


    useEffect(() => {

        if (debouncedSearchTerm < 3) {
            setOptions([]);
            return undefined;
        }

        (async () => {

            try {

                setLoading(true);
                setOpen(true);

                const { data } = await axios(`/api/search/list`, {
                    params: { q: debouncedSearchTerm }
                });

                if (data.products.length > 0) {

                    const rezult = data.products;
                    if (data.products.length > 5) {                       
                        rezult.push({
                            link: data.searchAll + '?q=' + debouncedSearchTerm,
                            title: "Показать все"
                        })
                    }
                    setOptions(rezult);

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
    }, [debouncedSearchTerm]);

    // useEffect(() => {
    //     if (!open && optionsLength) setOptions([]);
    // }, [open, optionsLength]);


    return (


        <CssAutocomplete
            open={open}
            // freeSolo
            // onOpen={() => {
            //     setOpen(true);
            // }}

            onChange={(e, newValue) => handleSelect(e, newValue)}
            onClose={() => {
                setOpen(false);
            }}
            getOptionLabel={(option) => option.title}
            getOptionSelected={(option, value) => {
                return option.title === value.title;
            }}
            options={options}
            loading={loading}
            forcePopupIcon={false}
            loadingText="Поиск..."
            noOptionsText="К сожалению ни чего не найдено"
            onInputChange={handleInput}
            inputValue={searchTerm}
            filterOptions={(options, params) => {
                const rezult = options;
                if (params.inputValue !== '') {
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
                                {loading ? <CircularProgress color="inherit" size={20} /> : null}
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
}


// Search.defaultProps = {
//     root: false,
// };


Search.propTypes = {
    fclose: PropTypes.func,
};

export default Search;