import React, { useContext, useEffect, useState } from "react";
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
import { Search20, Notification20, AppSwitcher20, UserAvatar20, Logout20, Power20 } from "@carbon/icons-react";
import "./_style.css";
import { useHistory } from "react-router-dom";
import SidenavBar from "../../components/Sidenav/SidenavBar";
import { useSelector, useDispatch } from "react-redux";
import { authCheckState, authLogout, logout } from "../../store/actions/auth";
import IncomingCall from "../../components/IncomingCall/IncomingCall";
import { SocketContext } from "../../context/GlobalSocketContext";
import NotificationHelper from "../../components/Notification/Notification";

function LayoutNav(props) {
     const token = useSelector((state) => state.auth.token);
    const dispatch = useDispatch();
    const [isSideNavExpanded, setisSideNavExpanded] = useState(false);
    const onClickSideNavExpand = () => {
        setisSideNavExpanded((prev) => !prev);
    };
    const history = useHistory();
    const context = useContext(SocketContext);
    const style = {
        height: "100%",
    };
    const handleLogout = ()=>{
      dispatch(logout());
      history.push("/")
    }
    return (
        <div className="root">
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
                <HeaderName onClick={()=>history.push("/")} prefix="Connect" />
                <HeaderGlobalBar>
                  <HeaderGlobalAction aria-label="Search" onClick={()=>history.push("/dashboard/meet")} style={{background:"#161616"}}>
                    <Search20 />
                  </HeaderGlobalAction>
                  <HeaderGlobalAction aria-label="Profile" onClick={()=>history.push("/dashboard/settings")} style={{background:"#161616"}}>
                    <UserAvatar20 />
                  </HeaderGlobalAction>
                  {/* <HeaderGlobalAction aria-label="Notifications" onClick={onClickSideNavExpand}>
                  <Notification20 />
                </HeaderGlobalAction> */}
                  <HeaderGlobalAction
                    aria-label="Logout"
                    onClick={()=>handleLogout()}
                    tooltipAlignment="end"
                    style={{background:"#161616"}}
                  >
                    <Power20 />
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
        {!context.CallAccepted && context.CallData.isReceived? (
          <IncomingCall user={context.CallData?.call_from} />
        ) : null}
         <NotificationHelper/>
      </div>
        </div>
    )
}

export default LayoutNav
