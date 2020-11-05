import { useState, useEffect, ChangeEvent } from "react";

const useLogger = (value: string) => {
  useEffect(() => {
    console.log("Value changed", value);
  }, [value]);
};

const useInput = (initialValue: string) => {
  const [value, setValue] = useState(initialValue);

  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
  };

  const clear = () => setValue("");

  const bind = { value, onChange };

  return {
    bind,
    value,
    clear,
  };
};

export { useInput, useLogger };
