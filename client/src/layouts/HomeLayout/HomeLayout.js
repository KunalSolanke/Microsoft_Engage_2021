import React, { Children } from "react";
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
import { AppSwitcher20 } from "@carbon/icons-react";

function HomeLayout(props) {
  return (
    <div
      className="container"
      style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}
    >
      <HeaderContainer
        render={() => (
          <>
            <Header aria-label="Connect Platform Name">
              <SkipToContent />
              <HeaderMenuButton
                aria-label="Open menu"
                isCollapsible
                onClick={() => {}}
                isActive={false}
              />
              <HeaderName href="#" prefix="Connect" />
              <HeaderNavigation aria-label="Connect">
                <HeaderMenuItem href="#">Services</HeaderMenuItem>
                <HeaderMenu aria-label="Link 4" menuLinkName="Accounts">
                  <HeaderMenuItem href="/dashboard">My Dashboard</HeaderMenuItem>
                  <HeaderMenuItem href="/accounts/login">Login</HeaderMenuItem>
                  <HeaderMenuItem href="/accounts/signup">Signup</HeaderMenuItem>
                </HeaderMenu>
                <HeaderMenuItem href="#">About</HeaderMenuItem>
                <HeaderMenuItem href="#">Contact</HeaderMenuItem>
              </HeaderNavigation>
              <HeaderGlobalBar>
                <HeaderGlobalAction
                  aria-label="App Switcher"
                  onClick={() => {}}
                  tooltipAlignment="end"
                >
                  <AppSwitcher20 />
                </HeaderGlobalAction>
              </HeaderGlobalBar>
            </Header>
          </>
        )}
      />
      <div style={{ flexGrow: 1, marginTop: "3rem" }}>{props.children}</div>
    </div>
  );
}

export default HomeLayout;
