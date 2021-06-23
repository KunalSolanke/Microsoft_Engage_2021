import { Column, Content, Grid, Row } from 'carbon-components-react'
import React from 'react'
import ChatBar from '../../components/ChatBar/ChatBar'
import DashboardLayout from '../../layouts/DashboardLayout/DashboardLayout'
import "./_styles.css"
import { UserAvatar16, VideoChat20, VideoChat32 } from '@carbon/icons-react'
import SendMessage from "../../components/SendMessage/SendMessage"
import UserChatArea from './UserChatArea'

function UserChatPage(props) {
    return (
        <DashboardLayout>
            <Content
            id="main-content"
            className="chatpage__wrapper">
                  <Grid className="chatpage__grid" fullWidth>
                      <Row className="chatpage__row">
                          <Column sm={0} md={2} lg={3} className="chat_tabs__area">
                              <ChatBar/>
                          </Column>
                          <Column sm={4} md={6} lg={13} style={{height:"100%",padding:"0rem"}} className="userchat">
                             <div className="chatpage_head">
                                <div>
                                    {props.user&&props.user.image? <>
                                    <img src={user.image} className="user__profile"/>
                                    </>
                                :(<UserAvatar16 className="user__profile"/>)}
                                    <h5>Percy Jackson</h5>
                                </div>
                                <div className="chathead__call">
                                  <VideoChat20/>
                                </div>
                             </div>
                             <UserChatArea/>
                             <div style={{padding:"1rem",display:"grid",placeItems:"center"}}>

                             <SendMessage/>
                             </div>
                          </Column>
                      </Row>
                  </Grid>
            </Content>
        </DashboardLayout>
    )
}

export default UserChatPage
