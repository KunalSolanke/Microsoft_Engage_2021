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
} from "carbon-components-react";
import { Search20, Notification20, AppSwitcher20 } from "@carbon/icons-react";
import { useHistory } from "react-router-dom";
import SidenavBar from "../../components/Sidenav/SidenavBar";
import { useSelector, useDispatch } from "react-redux";
import { authCheckState } from "../../store/actions/auth";

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
              <HeaderName href="#" prefix="Connect" />
              <HeaderNavigation aria-label="Connect">
                <HeaderMenuItem href="#">Link 1</HeaderMenuItem>
                <HeaderMenuItem href="#">Link 2</HeaderMenuItem>
                <HeaderMenuItem href="#">Link 3</HeaderMenuItem>
                <HeaderMenu aria-label="Link 4" menuLinkName="Link 4">
                  <HeaderMenuItem href="#">Sub-link 1</HeaderMenuItem>
                  <HeaderMenuItem href="#">Sub-link 2</HeaderMenuItem>
                  <HeaderMenuItem href="#">Sub-link 3</HeaderMenuItem>
                </HeaderMenu>
              </HeaderNavigation>
              <HeaderGlobalBar>
                <HeaderGlobalAction aria-label="Search" onClick={onClickSideNavExpand}>
                  <Search20 />
                </HeaderGlobalAction>
                <HeaderGlobalAction aria-label="Notifications" onClick={onClickSideNavExpand}>
                  <Notification20 />
                </HeaderGlobalAction>
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
            {props.children}
          </>
        )}
      />
    </div>
  );
}

export default DashboardLayout;
