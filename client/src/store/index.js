import authreducer from "./reducers/auth";
import socketReducer from "./reducers/socket";
import { createStore, compose, applyMiddleware, combineReducers } from "redux";
import thunk from "redux-thunk";

const configureStore = () => {
  let composeEnhances = compose;
  if (process.env.REACT_APP_ENV == "env") {
    composeEnhances = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || composeEnhances;
  }
  const rootReducer = combineReducers({
    auth: authreducer,
    socket: socketReducer,
  });
  const store = createStore(rootReducer, composeEnhances(applyMiddleware(thunk)));
  return store;
};

const store = configureStore();
export default store;
