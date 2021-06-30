import React from "react";
import {
  SideNav,
  SideNavItems,
  SideNavLink,
  SideNavMenu,
  SideNavMenuItem,
} from "carbon-components-react";
import { Chat20, Settings20, Activity20, Video20, Group20, Dashboard16 } from "@carbon/icons-react";

function SidenavBar({ isSideNavExpanded, onClickSideNavExpand }) {
  return (
    <div>
      <SideNav
        aria-label="Side navigation"
        isRail
        expanded={isSideNavExpanded}
        onOverlayClick={onClickSideNavExpand}
      >
        <SideNavItems>
          <SideNavLink renderIcon={Dashboard16} href="/dashboard">
            Dashboard
          </SideNavLink>
          <SideNavLink renderIcon={Video20} href="/dashboard/meet">
            Call
          </SideNavLink>
          <SideNavLink renderIcon={Chat20} href="/dashboard/chat">
            Chat
          </SideNavLink>
          <SideNavLink renderIcon={Group20} href="/dashboard/teams">
            Teams
          </SideNavLink>
          <SideNavLink renderIcon={Activity20} href="/dashboard/activity">
            Activity
          </SideNavLink>
          <SideNavLink renderIcon={Settings20} href="/dashboard/settings">
            Settings
          </SideNavLink>
        </SideNavItems>
      </SideNav>
    </div>
  );
}

export default SidenavBar;
