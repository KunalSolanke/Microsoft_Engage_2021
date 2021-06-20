// useSelectors.js
import useStore from "./useStore";
function useSelectors(...selectors) {
  const [state] = useStore();
  return selectors.map((selector) => selector(state));
}

export default useSelectors;
