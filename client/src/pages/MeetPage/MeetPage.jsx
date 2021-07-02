import { Column, Content, Grid, Row } from 'carbon-components-react'
import React, { useContext, useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import { Prompt, useParams } from 'react-router-dom'
import PeerVideos from '../../components/PeerVideos/PeerVideos'
import VideoControls from '../../components/VideoControls/VideoControls'
import { SocketContext } from '../../context/GlobalSocketContext'
import DashboardLayout from '../../layouts/DashboardLayout/DashboardLayout'
import MeetSidebar from './MeetSidebar'
import "./_style.css"

function MeetPage() {
    const context = useContext(SocketContext)
    const {meetID} = useParams()
    const auth = useSelector(state => state.auth)

  const alertUser = e => {
    e.preventDefault()
    e.returnValue = ''
  }
    
    useEffect(() => {
        console.log("Intializing the meet")
        if(auth.userID)context.initializeVideoCall(meetID)
        window.addEventListener('beforeunload', alertUser)
        window.addEventListener('unload',()=>context.reinitialize(meetID))
        return ()=>{
             window.removeEventListener('beforeunload', alertUser)
             window.removeEventListener('unload',()=>context.reinitialize(meetID));
             context.reinitialize(meetID)
        }
    }, [auth.userID])

    useEffect(() => {
       console.log("parent mount")
       
    }, [])


    return (
        <DashboardLayout>
            <Content
              id="main-content"
              className="dashboard_main_area dark"
        >
            <Prompt
                    message={(location, action) => {
                    if (action === 'POP'||action=="PUSH") {
                        context.reinitialize(meetID);
                    }
                    return "Are you sure you want to leave the meet?";
                    }}
                    />
                <Grid className="meetgrid" fullWidth={true}>
                   <Row className="meet__row">
                       <Column>
                            <Grid className="video__grid">
                               <PeerVideos/>
                            <VideoControls/>
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
