import { Column, Content, Grid, Row } from 'carbon-components-react'
import React, { useContext, useEffect } from 'react'
import ChatBar from '../../components/ChatBar/ChatBar'
import DashboardLayout from '../../layouts/DashboardLayout/DashboardLayout'
import "./_styles.css"
import { UserAvatar16, VideoChat20, VideoChat32 } from '@carbon/icons-react'
import SendMessage from "../../components/SendMessage/SendMessage"
import UserChatArea from './UserChatArea'
import { socket, SocketContext } from '../../context/GlobalSocketContext'
import { useParams } from 'react-router-dom'
import * as actionTypes from "../../store/constants/socket"
import { useDispatch, useSelector } from 'react-redux'
import useFetchChat from '../../hooks/useFetchChat'
import HI from "../../assets/images/Hi.png"


function UserChatPage(props) {
    const context = useContext(SocketContext)
    const {chatID}= useParams()
    const dispatch = useDispatch()
    const token = useSelector(state => state.auth.token)
    const {data,isLoading,error,refetch}=useFetchChat(chatID);
    useEffect(()=>{
        context.socket.emit("join_chat",chatID)
        dispatch({
           type:actionTypes.SET_CHAT,
           payload:chatID
        })
        if(token)refetch(chatID);
    },[chatID,token])

    const makeCall = ()=>{
        if(data&&data.user)context.callUser({user:data.user})
        else alert("Please refresh the page")
    }

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
                                    {data?.user&&data?.user?.image? <>
                                    <img src={data?.user?.image} className="user__profile"/>
                                    </>
                                :(<UserAvatar16 className="user__profile"/>)}
                                    <h5>{data?.user?.username}</h5>
                                </div>
                                <div className="chathead__call" onClick={(e)=>makeCall()}>
                                  <VideoChat20/>
                                </div>
                             </div>
                             <UserChatArea HI={HI}/>
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
