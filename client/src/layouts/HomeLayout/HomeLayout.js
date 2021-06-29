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
} from "carbon-components-react";
import { AppSwitcher20 } from "@carbon/icons-react";
import DotcomShell from "@carbon/ibmdotcom-react/es/components/DotcomShell/DotcomShell";

function HomeLayout(props) {
  return (
    <DotcomShell
      footerProps={{
        type: "micro",
      }}
      mastheadProps={{
        platform: {
          name: "Connect",
          url: "/",
        },
        customProfileLogin: "/accounts/login",
        hasSearch: false,
        navigation: [
          {
            hasMenu: true,
            title: "Accounts",
            menuSections: [
              {
                menuItems: [
                  {
                    title: "My Dashboard",
                    url: "/dashboard",
                  },
                  {
                    title: "Login",
                    url: "/accounts/login",
                  },
                  {
                    title: "Signup",
                    url: "/accounts/signup",
                  },
                ],
              },
            ],
          },
          {
            hasMenu: false,
            title: "Services",
            url: "#services",
            menuSections: [],
          },
          {
            hasMenu: false,
            title: "Contact us",
            url: "/contacts",
            menuSections: [],
          },
          {
            hasMenu: false,
            title: "About",
            url: "/about",
            menuSections: [],
          },
        ],
        hasProfile: false,
      }}
    >
      <main id="main-content">
        <div style={{ paddingTop: "0rem" }}>{props.children}</div>
      </main>
    </DotcomShell>
  );
}

export default HomeLayout;
