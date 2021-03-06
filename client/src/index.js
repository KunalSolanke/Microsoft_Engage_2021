import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import * as Sentry from "@sentry/react";
import { Integrations } from "@sentry/tracing";
import "./global.scss";

import { Provider } from "react-redux";
import store from "./store";

//Sentry Setup
Sentry.init({
  dsn: process.env.REACT_APP_SENTRY_URL,
  integrations: [new Integrations.BrowserTracing()],
  tracesSampleRate: 1.0,
});

if (process.env.REACT_APP_ENV != "dev") {
  window.console.log = () => {};
}
/** Subscribing to redux store  */
ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root")
);
