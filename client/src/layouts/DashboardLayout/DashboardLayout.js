import React from "react";

import LayoutNav from "./LayoutNav";

function DashboardLayout(props) {
  return <LayoutNav>{props.children}</LayoutNav>;
}

export default DashboardLayout;
