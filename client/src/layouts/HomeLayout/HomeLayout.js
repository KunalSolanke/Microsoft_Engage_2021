import React from "react";
import {
  Header,
  HeaderMenuButton,
  HeaderName,
  HeaderNavigation,
  HeaderMenu,
  HeaderMenuItem,
  SkipToContent,
  HeaderContainer,
  SideNav,
  SideNavItems,
  HeaderSideNavItems,
} from "carbon-components-react";

import { useHistory } from "react-router-dom";

function HomeLayout(props) {
  const history = useHistory();
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
            <HeaderName onClick={() => history.push("/")} prefix="Connect"></HeaderName>
            <HeaderNavigation aria-label="Connect">
              {/* <HeaderMenuItem href="#services">Services</HeaderMenuItem> */}
              <HeaderMenu aria-label="Accounts" menuLinkName="Accounts">
                <HeaderMenuItem onClick={() => history.push("/dashboard")}>
                  Dashboard
                </HeaderMenuItem>
                <HeaderMenuItem onClick={() => history.push("/accounts/login")}>
                  Login
                </HeaderMenuItem>
                <HeaderMenuItem onClick={() => history.push("/accounts/signup")}>
                  Signup
                </HeaderMenuItem>
              </HeaderMenu>
              <HeaderMenuItem onClick={() => history.push("/about")}>About</HeaderMenuItem>
              <HeaderMenuItem onClick={() => history.push("/contact")}>Contact</HeaderMenuItem>
            </HeaderNavigation>
            <SideNav aria-label="Side navigation" expanded={isSideNavExpanded} isPersistent={false}>
              <SideNavItems>
                <HeaderSideNavItems>
                  {/* <HeaderMenuItem href="#services">Services</HeaderMenuItem> */}
                  <HeaderMenu aria-label="Accounts" menuLinkName="Accounts">
                    <HeaderMenuItem onClick={() => history.push("/dashboard")}>
                      Dashboard
                    </HeaderMenuItem>
                    <HeaderMenuItem onClick={() => history.push("/accounts/login")}>
                      Login
                    </HeaderMenuItem>
                    <HeaderMenuItem onClick={() => history.push("/accounts/signup")}>
                      Signup
                    </HeaderMenuItem>
                  </HeaderMenu>
                  <HeaderMenuItem onClick={() => history.push("/about")}>About</HeaderMenuItem>
                  <HeaderMenuItem onClick={() => history.push("/contact")}>Contact</HeaderMenuItem>
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
