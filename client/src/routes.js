import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import DashboardLayout from "./layouts/DashboardLayout/DashboardLayout";
import HomeLayout from "./layouts/HomeLayout";
import LoginPage from "./pages/LoginPage/LoginPage";
import SignUpPage from "./pages/LoginPage/SignupPage";
import SearchPage from "./pages/SearchPage/SearchPage";

const Router = () => {
  console.log("Starting app");
  return (
    <>
      <BrowserRouter>
        <Switch>
          <Route exact path="/" component={HomeLayout} />
          <Route exact path="/accounts/login" component={LoginPage}></Route>
          <Route exact path="/accounts/signup" component={SignUpPage}></Route>
          <Route exact path="/dashboard" component={DashboardLayout} />
          <Route exact path="/dashboard/meet" component={SearchPage} />
        </Switch>
      </BrowserRouter>
    </>
  );
};
export default Router;
