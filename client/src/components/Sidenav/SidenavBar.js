import React from "react";
import {
  SideNav,
  SideNavItems,
  SideNavLink,
  SideNavMenu,
  SideNavMenuItem,
} from "carbon-components-react";
import { Chat20, Settings20, Activity20, Video20, Group20 } from "@carbon/icons-react";

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
          {/* <SideNavMenu renderIcon={Fade16} title="Category title">
            <SideNavMenuItem href="javascript:void(0)">Link</SideNavMenuItem>
            <SideNavMenuItem aria-current="page" href="javascript:void(0)">
              Link
            </SideNavMenuItem>
            <SideNavMenuItem href="javascript:void(0)">Link</SideNavMenuItem>
          </SideNavMenu> */}
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
