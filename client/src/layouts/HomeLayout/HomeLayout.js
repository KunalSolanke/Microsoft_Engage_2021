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
  Content,
  SideNav,
  SideNavItems,
  HeaderSideNavItems,
} from "carbon-components-react";
import { AppSwitcher20 } from "@carbon/icons-react";
import DotcomShell from "@carbon/ibmdotcom-react/es/components/DotcomShell/DotcomShell";

function HomeLayout(props) {
  return (
    <HeaderContainer
      render={({ isSideNavExpanded, onClickSideNavExpand }) => (
        <>
          <Header aria-label="IBM Platform Name">
            <SkipToContent />
            <HeaderMenuButton
              aria-label="Open menu"
              onClick={onClickSideNavExpand}
              isActive={isSideNavExpanded}
            />
            <HeaderName href="/" prefix="Connect"></HeaderName>
            <HeaderNavigation aria-label="Connect">
              {/* <HeaderMenuItem href="#services">Services</HeaderMenuItem> */}
              <HeaderMenuItem href="/about">About</HeaderMenuItem>
              <HeaderMenuItem href="/contact">Contact</HeaderMenuItem>
              <HeaderMenu aria-label="Accounts" menuLinkName="Accounts">
                <HeaderMenuItem href="/dashboard">Dashboard</HeaderMenuItem>
                <HeaderMenuItem href="/accounts/login">Login</HeaderMenuItem>
                <HeaderMenuItem href="/accounts/signup">Signup</HeaderMenuItem>
              </HeaderMenu>
            </HeaderNavigation>
            <SideNav aria-label="Side navigation" expanded={isSideNavExpanded} isPersistent={false}>
              <SideNavItems>
                <HeaderSideNavItems>
                  {/* <HeaderMenuItem href="#services">Services</HeaderMenuItem> */}
                  <HeaderMenuItem href="/about">About</HeaderMenuItem>
                  <HeaderMenuItem href="/contact">Contact</HeaderMenuItem>
                  <HeaderMenu aria-label="Accounts" menuLinkName="Accounts">
                    <HeaderMenuItem href="/dashboard">Dashboard</HeaderMenuItem>
                    <HeaderMenuItem href="/accounts/login">Login</HeaderMenuItem>
                    <HeaderMenuItem href="/accounts/signup">Signup</HeaderMenuItem>
                  </HeaderMenu>
                </HeaderSideNavItems>
              </SideNavItems>
            </SideNav>
          </Header>
          <div style={{ marginTop: "3rem" }}>{props.children}</div>
        </>
      )}
    ></HeaderContainer>
  );
}

export default HomeLayout;
