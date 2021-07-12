import { Column, Content, Grid, Row } from 'carbon-components-react'
import React, { useContext, useEffect } from 'react'
import ChatBar from '../../components/ChatBar/ChatBar'
import DashboardLayout from '../../layouts/DashboardLayout/DashboardLayout'
import "./_styles.css"
import { UserAvatar16, VideoChat20, VideoChat32, Group16 } from '@carbon/icons-react'
import SendMessage from "../../components/SendMessage/SendMessage"
import UserChatArea from './UserChatArea'
import { socket, SocketContext } from '../../context/GlobalSocketContext'
import { useParams } from 'react-router-dom'
import * as actionTypes from "../../store/constants/socket"
import { useDispatch, useSelector } from 'react-redux'
import useFetchChat from '../../hooks/useFetchChat'
import HI from "../../assets/images/Hi.png"

/**
 * Chat page component
 * show invidual chat page
 * @component
 */

function UserChatPage(props) {
    const context = useContext(SocketContext)
    const {chatID}= useParams()
    const userID = useSelector(state=>state.auth.userID);
    const dispatch = useDispatch()
    const token = useSelector(state => state.auth.token)
    const {data,isLoading,error,refetch}=useFetchChat(chatID);
    /**Join chat  */
    useEffect(()=>{
        if(token)refetch(chatID);
    },[token])
 
    useEffect(()=>{
        context.socket.emit("join_chat",chatID)
        dispatch({
           type:actionTypes.SET_CHAT,
           payload:chatID
        })
        if(token)refetch(chatID);
    },[chatID])
    
    const makeCall = ()=>{
        if(data&&data.user)context.callUser({user:data.user},{chatID,userID:data.user._id})
        else alert("Please refresh the page")
    }

    let getTitle = (data)=>{
        let peers = data.participants.filter(p=>p._id!==userID);
        let chatpeople = peers.map(p=>p.username);
        return chatpeople.join()
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
                                    {data?.is_group?(<>
                            <Group16 className="user__profile"/>
                            </>):(<>{data?.user&&data?.user?.image? <>
                                                    <img src={data?.user?.image} className="user__profile"/>
                                                    </>
                                :(<UserAvatar16 className="user__profile"/>)}</>)}

                                <div>
                                	<h5>{data?.is_group?"Group":data?.user?.username}</h5>
					{data?.is_group?<p>{getTitle(data)}</p>:null}
		                </div>				
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
