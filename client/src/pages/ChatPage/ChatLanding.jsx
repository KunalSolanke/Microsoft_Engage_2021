import { Button, Column, Content, Grid, Row } from 'carbon-components-react'
import React from 'react'
import ChatBar from '../../components/ChatBar/ChatBar'
import DashboardLayout from '../../layouts/DashboardLayout/DashboardLayout'
import chatImage from "../../assets/images/chat.jpg"
import "./_styles.css"

function ChatLanding() {
    return (
        <DashboardLayout>
            <Content
            id="main-content"
            className="chatpage__wrapper">
                  <Grid className="chatpage__grid" fullWidth>
                      <Row className="chatpage__row">
                          <Column sm={4} md={2} lg={3} className="chat_tabs__area">
                              <ChatBar/>
                          </Column>
                          <Column sm={0} md={6} lg={13} style={{height:"100%"}}>
                             <div style={{display:"grid",placeItems:"center",height:"100%"}}>
                                 <div style={{display:"flex",flexDirection:"column",alignItems:"center"}}>
                                <img src={chatImage} className="chat__landing__img"/>
                                 <p>Add your friends to your contact list and have hassle free <br/>messaging anytime.</p>
                                  <Button kind="danger--tertiary" href="/dashboard/meet">Add Contacts</Button>
                                </div>
                             </div>
                          </Column>
                      </Row>
                  </Grid>
            </Content>
        </DashboardLayout>
    )
}

export default ChatLanding
