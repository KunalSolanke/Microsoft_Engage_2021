import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import DashboardLayout from "./layouts/DashboardLayout/DashboardLayout";
import HomeLayout from "./layouts/HomeLayout";
import LoginPage from "./pages/LoginPage/LoginPage";
import SignUpPage from "./pages/LoginPage/SignupPage";
import SearchPage from "./pages/SearchPage/SearchPage";
import MeetPage from "./pages/MeetPage/MeetPage";
import CreateCall from "./pages/CreateCall/CreateCall";
import { ContextProvider } from "./context/GlobalSocketContext";

const DashBoardRoutes = () => (
  <ContextProvider>
    <Route exact path="/dashboard" component={DashboardLayout} />
    <Route exact path="/dashboard/meet" component={SearchPage} />
    <Route exact path="/dashboard/calluser" component={CreateCall} />
    <Route exact path="/dashboard/meet/:meetID" component={MeetPage} />
  </ContextProvider>
);

const Router = () => {
  console.log("Starting app");
  return (
    <>
      <BrowserRouter>
        <Switch>
          <Route exact path="/" component={HomeLayout} />
          <Route exact path="/accounts/login" component={LoginPage}></Route>
          <Route exact path="/accounts/signup" component={SignUpPage}></Route>
          <DashBoardRoutes />
        </Switch>
      </BrowserRouter>
    </>
  );
};
export default Router;
