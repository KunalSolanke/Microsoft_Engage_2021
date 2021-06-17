import { Column, Content, Grid, Row } from 'carbon-components-react'
import React, { useContext, useEffect } from 'react'
import { Prompt } from 'react-router-dom'
import CallVideo from '../../components/CallVideo/CallVideo'
import { SocketContext } from '../../context/GlobalSocketContext'
import DashboardLayout from '../../layouts/DashboardLayout/DashboardLayout'
import "./_style.css"

function MeetPage() {
    const context = useContext(SocketContext)
    useEffect(() => {
        context.initializeVideoCall()
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
                    }

                    return true;
                    }}
                    />
                <Grid className="meetgrid" fullWidth={true}>
                   <Row className="meet__row">
                       <Column sm={4} md={6} lg={9}>
                            <Grid className="video__grid">
                                <Row className="video__row">
                                    <Column lg={4}>
                                      <CallVideo mine={true}/>
                                    </Column>
                                </Row>
                            </Grid>
                       </Column>
                        <Column sm={4} md={2} lg={3} className="chatbox">
                           
                       </Column>
                   </Row>
                </Grid>
        </Content>
        </DashboardLayout>
        
    )
}

export default MeetPage

headers = {
    "content-type":"application/json"
}

