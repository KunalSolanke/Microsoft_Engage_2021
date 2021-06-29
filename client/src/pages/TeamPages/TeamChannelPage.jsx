import { Column, Content, Grid, Row } from 'carbon-components-react'
import React, { useContext, useEffect } from 'react'
import DashboardLayout from '../../layouts/DashboardLayout/DashboardLayout'
import "./_styles.css"
import { Collaborate16, Events16, VideoChat20 } from '@carbon/icons-react'
import SendMessage from "../../components/SendMessage/SendMessage"
import { SocketContext } from '../../context/GlobalSocketContext'
import { useParams } from 'react-router-dom'
import * as actionTypes from "../../store/constants/socket"
import { useDispatch, useSelector } from 'react-redux'
import UserChatArea from '../ChatPage/UserChatArea'
import TeamBar from '../../components/TeamBar/TeamBar'
import useFetchChannel from '../../hooks/useFetchChannel'
import ChannelMessage from '../../components/Message/ChannelMessage'
import TeamChatArea from './TeamChatArea'
import HI from "../../assets/images/team.webp"


function TeamChatPage(props) {
    const context = useContext(SocketContext)
    const {channelID}= useParams()
    const dispatch = useDispatch()
    const token = useSelector(state => state.auth.token)
    const {data,isLoading,error,refetch}=useFetchChannel(channelID);
    useEffect(()=>{
        context.socket.emit("join_chat",channelID)
        dispatch({
           type:actionTypes.SET_CHAT,
           payload:channelID
        })
        if(token)refetch(channelID);
    },[channelID,token])
    
    const makeCall = ()=>{
        context.groupMeet(channelID)
    }

    return (
        <DashboardLayout>
            <Content
            id="main-content"
            className="chatpage__wrapper teamspage__wrapper">
                  <Grid className="chatpage__grid" fullWidth>
                      <Row className="chatpage__row">
                          <Column sm={0} md={2} lg={3} className="chat_tabs__area">
                              <TeamBar team={data?.team||null}/>
                          </Column>
                          <Column sm={4} md={6} lg={13} style={{height:"100%",padding:"0rem"}} className="userchat">
                             <div className="chatpage_head">
                                <div>
                                    <Collaborate16 className="user__profile"/>
                                    <div>
                                    <h6>{data?.channel?.channel_name}</h6>
                                    <p>{data?.channel.description?.toLowerCase()}</p> 
                                    </div>
                                </div>
                                <div className="chathead__call" onClick={(e)=>makeCall()}>
                                  <VideoChat20/>
                                </div>
                             </div>
                             <UserChatArea HI={HI}/>
                             <div style={{padding:"1rem",display:"grid",placeItems:"center"}}>
                             <SendMessage light={true}/>
                             </div>
                          </Column>
                      </Row>
                  </Grid>
            </Content>
        </DashboardLayout>
    )
}

export default TeamChatPage
