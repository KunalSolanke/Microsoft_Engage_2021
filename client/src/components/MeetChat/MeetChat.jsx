import { Chat20, Close20 } from '@carbon/icons-react'
import React, { useContext, useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import useSelectors from '../../hooks/useSelector'
import Message from '../Message/Message'
import SendMessage from '../SendMessage/SendMessage'
import "./_style.css"

function MeetChat() {
   const messageEl= useRef(null);
    const messages= useSelector(state => state.socket.currMessages)
    const scrollBottom =  event => {
        const { currentTarget: target } = event;
        target.scroll({ top: target.scrollHeight, behavior: 'smooth' });
      }
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
    return (
        <div className="meetchat_area">
           <div className="meetchat__head">
               <div>
                  <Chat20  className="meet__chat__icon"></Chat20>
                  <h4>MeetChat</h4>
               </div>
               <Close20></Close20>
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
