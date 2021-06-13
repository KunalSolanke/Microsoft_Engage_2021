import React from 'react';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import WelcomeScreen from 'src/layouts/WelcomeScreen/WelcomeScreen';

const Router = () => {
    console.log('Starting app');
    return (
        <>
            <BrowserRouter>
                <Switch>
                    <Route path="/" component={WelcomeScreen} />
                </Switch>
            </BrowserRouter>
        </>
    );
};
export default Router;
