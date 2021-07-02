import React from "react";
import {
  SideNav,
  SideNavItems,
  SideNavLink,
  SideNavMenu,
  SideNavMenuItem,
} from "carbon-components-react";
import { Chat20, Settings20, Activity20, Video20, Group20, Dashboard16 } from "@carbon/icons-react";
import { useHistory } from "react-router-dom";

function SidenavBar({ isSideNavExpanded, onClickSideNavExpand }) {
  const history = useHistory();
  return (
    <div>
      <SideNav
        aria-label="Side navigation"
        isRail
        expanded={isSideNavExpanded}
        onOverlayClick={onClickSideNavExpand}
      >
        <SideNavItems>
          <SideNavLink renderIcon={Dashboard16} onClick={() => history.push("/dashboard")}>
            Dashboard
          </SideNavLink>
          <SideNavLink renderIcon={Video20} onClick={() => history.push("/dashboard/meet")}>
            Call
          </SideNavLink>
          <SideNavLink renderIcon={Chat20} onClick={() => history.push("/dashboard/chat")}>
            Chat
          </SideNavLink>
          <SideNavLink renderIcon={Group20} onClick={() => history.push("/dashboard/teams")}>
            Teams
          </SideNavLink>
          <SideNavLink renderIcon={Activity20} onClick={() => history.push("/dashboard/activity")}>
            Activity
          </SideNavLink>
          <SideNavLink renderIcon={Settings20} onClick={() => history.push("/dashboard/settings")}>
            Settings
          </SideNavLink>
        </SideNavItems>
      </SideNav>
    </div>
  );
}

export default SidenavBar;
