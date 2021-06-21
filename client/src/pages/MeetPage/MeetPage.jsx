import { Column, Content, Grid, Row } from 'carbon-components-react'
import React, { useContext, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Prompt, useParams } from 'react-router-dom'
import MeetChat from '../../components/MeetChat/MeetChat'
import MeetPeople from '../../components/MeetPeople/MeetPeople'
import PeerVideos from '../../components/PeerVideos/PeerVideos'
import VideoControls from '../../components/VideoControls/VideoControls'
import { SocketContext } from '../../context/GlobalSocketContext'
import DashboardLayout from '../../layouts/DashboardLayout/DashboardLayout'
import "./_style.css"

function MeetPage() {
    const context = useContext(SocketContext)
    const {meetID} = useParams()
    const isChatActive = useSelector(state=>state.socket.isChatActive)
    const isPeopleActive = useSelector(state=>state.socket.isPeopleActive)
    const auth = useSelector(state => state.auth)
    useEffect(() => {
        console.log("Intializing the meet")
        if(auth.userID)context.initializeVideoCall(meetID)
        return ()=>{
             console.log("Leaving meet... ");
        context.socket.emit("leave_meet", meetID);
        }
    }, [auth.userID])

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
                    }
                    
                    return true;
                    }}
                    />
                <Grid className="meetgrid" fullWidth={true}>
                   <Row className="meet__row">
                       <Column sm={4} md={6} lg={isPeopleActive||isChatActive?9:12}>
                            <Grid className="video__grid">
                               <PeerVideos/>
                            </Grid>
                            <VideoControls/>
                       </Column>
                        {isChatActive?<Column sm={4} md={2} lg={3} className="chatbox">
                           <MeetChat/>
                       </Column>:null}
                       {isPeopleActive?<Column sm={4} md={2} lg={3} className="chatbox">
                           <MeetPeople/>
                       </Column>:null}
                   </Row>
                </Grid>
        </Content>
        </DashboardLayout>
        
    )
}

export default MeetPage
