import { useState, useEffect } from 'react';
//import { useSelector } from 'react-redux';

const useLogger = value => {
    useEffect(() => {
        console.log('Value changed', value)
    }, [value]);
}

const useInput = initialValue => {

    const [value, setValue] = useState(initialValue);

    // const initialStatus = {
    //     error: false,
    //     helperText: ''
    // }

    // const [status, setStatusState] = useState(initialStatus);

    const onChange = event => {
        setValue(event.target.value)
    }

    // const setStatus = (helperText, error = false) => {
    //     setStatusState({ helperText, error });
    // }

    // const clearStatus = () => {
    //     setStatusState(initialStatus);
    // }



    const clear = () => setValue('');
    // const error = status.error;
    // const helperText = status.helperText;
    const bind = { value, onChange }

    // if (bindHelperText) {
    //     bind.helperText = helperText;
    // }

    return {
        bind,
        value,
        clear
    }


}

export { useInput, useLogger };