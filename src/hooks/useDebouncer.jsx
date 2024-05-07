import { useState, useEffect } from "react";

const useDebouncer = (value, delay) => {
  const [debuncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const debounceFn = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => clearTimeout(debounceFn);
  }, [value, delay]);
  return debuncedValue;
};

export default useDebouncer;
