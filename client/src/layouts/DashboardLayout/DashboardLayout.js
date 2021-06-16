import React, { useEffect, useState } from "react";
import {
  Header,
  HeaderMenuButton,
  HeaderName,
  HeaderNavigation,
  HeaderMenu,
  HeaderMenuItem,
  HeaderGlobalBar,
  HeaderGlobalAction,
  SkipToContent,
  HeaderContainer,
  Content,
} from "carbon-components-react";
import { Search20, Notification20, AppSwitcher20, UserAvatar20 } from "@carbon/icons-react";
import "./_style.css";
import { useHistory } from "react-router-dom";
import SidenavBar from "../../components/Sidenav/SidenavBar";
import { useSelector, useDispatch } from "react-redux";
import { authCheckState } from "../../store/actions/auth";
import IncomingCall from "../../components/IncomingCall/IncomingCall";

function DashboardLayout(props) {
  const token = useSelector((state) => state.auth.token);
  const dispatch = useDispatch();
  const [isSideNavExpanded, setisSideNavExpanded] = useState(false);
  const onClickSideNavExpand = () => {
    setisSideNavExpanded((prev) => !prev);
  };
  const history = useHistory();
  useEffect(() => {
    if (!token) {
      dispatch(authCheckState(history));
    }
  }, [token]);

  const style = {
    height: "100%",
  };

  return (
    <div className="container" style={{ minHeight: "100vh" }}>
      <HeaderContainer
        render={({ isSideNavExpanded, onClickSideNavExpand }) => (
          <>
            <Header aria-label="IBM Platform Name">
              <SkipToContent />
              <HeaderMenuButton
                aria-label="Open menu"
                isCollapsible
                onClick={onClickSideNavExpand}
                isActive={isSideNavExpanded}
              />
              <HeaderName href="/" prefix="Connect" />
              <HeaderGlobalBar>
                <HeaderGlobalAction aria-label="Search" onClick={onClickSideNavExpand}>
                  <Search20 />
                </HeaderGlobalAction>
                <HeaderGlobalAction aria-label="Profile" onClick={onClickSideNavExpand}>
                  <UserAvatar20 />
                </HeaderGlobalAction>
                {/* <HeaderGlobalAction aria-label="Notifications" onClick={onClickSideNavExpand}>
                  <Notification20 />
                </HeaderGlobalAction> */}
                <HeaderGlobalAction
                  aria-label="App Switcher"
                  onClick={onClickSideNavExpand}
                  tooltipAlignment="end"
                >
                  <AppSwitcher20 />
                </HeaderGlobalAction>
              </HeaderGlobalBar>
              <SidenavBar
                isSideNavExpanded={isSideNavExpanded}
                onClickSideNavExpand={onClickSideNavExpand}
              />
            </Header>
            <Content id="main-content" style={style} className="dashboard_main_area">
              {props.children}
            </Content>
          </>
        )}
      />
      {/* <IncomingCall user={null} /> */}
    </div>
  );
}

export default DashboardLayout;
