import { Column, Content, Grid, Row } from 'carbon-components-react'
import React, { useContext, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Prompt, useHistory, useParams } from 'react-router-dom'
import CallVideo from '../../components/CallVideo/CallVideo'
import MeetChat from '../../components/MeetChat/MeetChat'
import { SocketContext } from '../../context/GlobalSocketContext'
import DashboardLayout from '../../layouts/DashboardLayout/DashboardLayout'
import "./_style.css"

function MeetPage() {
    const context = useContext(SocketContext)
    const {meetID} = useParams()
    const [colLg, setcolLg] = useState(6)
    const auth = useSelector(state => state.auth)
    useEffect(() => {
        if(auth.userID)context.initializeVideoCall(meetID)

        return ()=>{
            context.socket.emit("leave_meet",meetID);
        }
    }, [auth.userID])

    useEffect(()=>{
      if(context.peers.length>4)setcolLg(4);
    },[context.peers])
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
                       <Column sm={4} md={6} lg={9}>
                            <Grid className="video__grid">
                                <Row className="video__row">
                                    <Column md={4} sm={4} lg={colLg}>
                                      <video autoPlay playsInline ref={context.userVideoRef} className="videoplayer mine">
          
                                      </video>
                                    </Column>
                                    {context.peers.map((peerObj,i)=>(
                                    <Column md={4} sm={4} lg={colLg} key={peerObj.peerID}>
                                      <CallVideo peer={peerObj.peer}/>
                                    </Column>))}
                                </Row>
                            </Grid>
                       </Column>
                        <Column sm={4} md={2} lg={3} className="chatbox">
                           <MeetChat/>
                       </Column>
                   </Row>
                </Grid>
        </Content>
        </DashboardLayout>
        
    )
}

export default MeetPage
