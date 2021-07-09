import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import LoginPage from "./pages/LoginPage/LoginPage";
import SignUpPage from "./pages/LoginPage/SignupPage";
import SearchPage from "./pages/SearchPage/SearchPage";
import MeetPage from "./pages/MeetPage/MeetPage";
import CreateCall from "./pages/CreateCall/CreateCall";
import { ContextProvider } from "./context/GlobalSocketContext";
import ChatLanding from "./pages/ChatPage/ChatLanding";
import UserChatPage from "./pages/ChatPage/UserChatPage";
import TeamsPage from "./pages/TeamPages/TeamsPage";
import TeamsLandingPage from "./pages/TeamPages/TeamsLandingPage";
import TeamChatPage from "./pages/TeamPages/TeamChannelPage";
import JoinTeam from "./pages/TeamPages/JoinTeam";
import Settings from "./pages/Settings/Settings";
import Activity from "./pages/Activity/Activity";
import LandingPage from "./pages/LandingPage/LandingPage";
import DashboardMain from "./pages/DashboardMain/DashboardMain";
import AboutPage from "./pages/AboutPage/AboutPage";
import ContactPage from "./pages/ContactPage/ContactPage";
import Calendar from "./pages/Calendar/Calendar";
import Error404 from "./components/Errors/Error404";
import { ErrorBoundary } from "carbon-components-react";
import ErrorOther from "./components/Errors/ErrorOther";

const DashBoardRoutes = () => (
  <ContextProvider>
    <Switch>
      <Route exact path="/dashboard" component={DashboardMain} />
      <Route exact path="/dashboard/meet" component={SearchPage} />
      <Route exact path="/dashboard/calluser" component={CreateCall} />
      <Route exact path="/dashboard/chat" component={ChatLanding} />
      <Route exact path="/dashboard/settings" component={Settings} />
      <Route exact path="/dashboard/activity" component={Activity} />
      <Route exact path="/dashboard/calendar" component={Calendar} />
      <Route exact path="/dashboard/teams" component={TeamsPage} />
      <Route exact path="/dashboard/teams/:teamID" component={TeamsLandingPage} />
      <Route exact path="/dashboard/teams/:teamID/join" component={JoinTeam} />
      <Route exact path="/dashboard/channels/:channelID" component={TeamChatPage} />
      <Route exact path="/dashboard/chat/:chatID" component={UserChatPage} />
      <Route exact path="/dashboard/meet/:meetID" component={MeetPage} />
      <Route component={Error404} />
    </Switch>
  </ContextProvider>
);

const Router = () => {
  console.log("Starting app");
  return (
    <ErrorBoundary fallback={<ErrorOther />}>
      <BrowserRouter>
        <Switch>
          <Route exact path="/" component={LandingPage} />
          <Route exact path="/accounts/login" component={LoginPage}></Route>
          <Route exact path="/accounts/signup" component={SignUpPage}></Route>
          <Route exact path="/about" component={AboutPage}></Route>
          <Route exact path="/contact" component={ContactPage}></Route>
          <DashBoardRoutes />
        </Switch>
      </BrowserRouter>
    </ErrorBoundary>
  );
};
export default Router;
