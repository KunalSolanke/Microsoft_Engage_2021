import { Chat20, Close20 } from '@carbon/icons-react'
import React, { useContext, useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../Message/Message'
import SendMessage from '../SendMessage/SendMessage'
import * as actionTypes from "../../store/constants/socket"
import "./_style.css"

/**
 * Meeting chat area component
 * renders the side meeting chat bar in met
 * @component
 */
function MeetChat() {
   const messageEl= useRef(null);
    const messages= useSelector(state => state.socket.currMessages)
    const dispatch = useDispatch()
    /**Scroll to bottom listener */
    const scrollBottom =  event => {
        const { currentTarget: target } = event;
        target.scroll({ top: target.scrollHeight, behavior: 'smooth' });
      }
    /**On new message scroll to bottom  */
    useEffect(() => {
        if (messageEl) {
         messageEl.current?.addEventListener('DOMNodeInserted',scrollBottom);
    }
    return ()=>{
        if(messageEl){
            messageEl.current?.removeEventListener("DOMNodeInserted",scrollBottom)
        }
    }
    }, [messages])
    const openChat = (e)=>{dispatch({
        type:actionTypes.CHAT_ACTIVE
    })}
    return (
        
        <div className="meetchat_area">
           <div className="meetchat__head">
               <div>
                  <Chat20  className="meet__chat__icon"></Chat20>
                  <h5>MeetChat</h5>
               </div>
               <Close20 onClick={e=>openChat(e)}></Close20>
           </div>
           <hr color="#ededed"></hr>
           <div className="messages__area" ref={messageEl}>
              {messages.map(m=>{
                  return <Message key={m._id} message={m}/>
              })}
              {/* <div ref={messagesEndRef} /> */}
           </div>
           <SendMessage/>
        </div>
    )
}

export default MeetChat
