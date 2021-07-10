import { InlineNotification, NotificationActionButton } from 'carbon-components-react'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import "./_styles.css"
import * as actionTypes from "../../store/constants/auth"
const notificationProps = () => ({
  lowContrast:false,
  statusIconDescription:"notification",
});

/**
 * Notification 
 * Displays notification componet on top right whenever global state open is 
 * set to true
 * @component
 * 
 */

function NotificationHelper() {
    const dispatch = useDispatch()
    const handleClose = ()=>{
      dispatch({
         type:actionTypes.SET_NOTIFICATION,
         payload:{
             open:false,
             title:"",
             message:"",
             kind:""
         }
      })
    }
    const notification = useSelector(state => state.auth.notification)
    return notification.open?(
        <div className="notification__wrapper">
             <InlineNotification
            {...notificationProps()}
            onClose={()=>handleClose()}
            onCloseButtonClick = {()=>handleClose()}
            kind={notification.kind}
            title={notification.title}
            subtitle={notification.message}
            actions={
            <NotificationActionButton
                onClick={()=>handleClose()}>
                Close
            </NotificationActionButton>
            }
        />
        </div>
    ):(<></>)
}

export default NotificationHelper
