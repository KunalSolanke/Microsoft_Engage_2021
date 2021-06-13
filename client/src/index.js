import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as Sentry from '@sentry/react';
import {Integrations} from '@sentry/tracing';
import './global.scss';

import {Provider} from 'react-redux';
import configureStore from './store';

export const store = configureStore();
//Sentry Setup
Sentry.init({
    dsn: process.env.REACT_APP_SENTRY_URL,
    integrations: [new Integrations.BrowserTracing()],

    // Set tracesSampleRate to 1.0 to capture 100%
    // of transactions for performance monitoring.
    // We recommend adjusting this value in production
    tracesSampleRate: 1.0,
});
ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('root')
);
