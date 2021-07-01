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
    const  userVideoStream= useSelector(state => state.socket.userVideoStream)

    useEffect(() => {
        console.log("Intializing the meet")
        let cleanup= ()=>{}
        if(auth.userID)cleanup=context.initializeVideoCall(meetID)
        return ()=>{
             console.log("Leaving meet... ");
             context.socket.emit("leave_meet", meetID);
             cleanup();
            //if(userVideoStream)userVideoStream.getVideoTracks[0]?.stop()

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
                    if (action === 'POP') {
                        console.log("Backing up...")
                        context.reinitialize();
                        context.socket.emit("leave_meet",meetID);
                       // if(userVideoStream)userVideoStream.getVideoTracks[0]?.stop()
                    }
                    
                    return true;
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
