import React from "react";
/**
 * Debounce the search query to provide better ux
 * @param {*} value value that is to be debounced
 * @param {} delay by how much the value should be debounced
 */
export default function useDebounce(value, delay = 1000) {
  const [debouncedValue, setDebouncedValue] = React.useState(value);

  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Cancel the timeout if value changes (also on delay change or unmount)
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
