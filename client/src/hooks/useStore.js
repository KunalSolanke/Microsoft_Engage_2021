// useStore.js
import { useState, useEffect, useContext } from "react";
import { ReactReduxContext } from "react-redux";
function useStore() {
  const { store } = useContext(ReactReduxContext);
  const { getState, dispatch, subscribe } = store;
  const [storeState, setStoreState] = useState(getState());

  // subscribe only once
  useEffect(() => subscribe(() => setStoreState(getState()), []));

  return [storeState, dispatch];
}

export default useStore;
