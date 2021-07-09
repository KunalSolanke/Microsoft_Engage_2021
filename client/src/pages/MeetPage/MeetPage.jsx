import { Column, Content, Grid, Row } from 'carbon-components-react'
import React, { useContext, useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import { Prompt, useParams } from 'react-router-dom'
import PeerVideos from '../../components/PeerVideos/PeerVideos'
import VideoControls from '../../components/VideoControls/VideoControls'
import { SocketContext } from '../../context/GlobalSocketContext'
import DashboardLayout from '../../layouts/DashboardLayout/DashboardLayout'
import MeetSidebar from './MeetSidebar'
import NavigationPrompt from "react-router-navigation-prompt";
import "./_style.css"
import LeaveMeet from '../../components/LeaveMeet/LeaveMeet'

function MeetPage() {
    const context = useContext(SocketContext)
    const {meetID} = useParams()
    const auth = useSelector(state => state.auth)

  const alertUser = e => {
    e.preventDefault()
    e.returnValue = ''
  }
    
    useEffect(() => {
        if(auth.profile)context.initializeVideoCall(meetID)
        window.addEventListener('beforeunload', alertUser)
        window.addEventListener('unload',()=>context.leaveCall(meetID))
        return ()=>{
             window.removeEventListener('beforeunload', alertUser)
             window.removeEventListener('unload',()=>context.leaveCall(meetID));
             context.leaveCall(meetID)
        }
    }, [auth.profile])

    return (
        <DashboardLayout>
            <Content
              id="main-content"
              className="dashboard_main_area dark"
        >
           <NavigationPrompt when={true}>
            {({ onConfirm, onCancel }) => (
                <LeaveMeet
                onCancel={onCancel}
                onConfirm={onConfirm}
                />
            )}
            </NavigationPrompt>
                <Grid className="meetgrid" fullWidth={true}>
                   <Row className="meet__row" condensed>
                       <Column>
                            <Grid className="video__grid" fullWidth={true}>
                               <PeerVideos/>
                            </Grid>
                       </Column>
                       <MeetSidebar/>
                   </Row>
                </Grid>
        </Content>
        </DashboardLayout>
        
    )
}

export default MeetPage
