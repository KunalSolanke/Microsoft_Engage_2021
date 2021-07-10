import React from "react";

import LayoutNav from "./LayoutNav";
/**
 * Dashboard base interface
 * @component
 * Dashbboard navbar,and basic styles
 */
function DashboardLayout(props) {
  return (
    <>
      <LayoutNav className="root">{props.children}</LayoutNav>
    </>
  );
}

export default DashboardLayout;
