import { Chat20, Close20 } from '@carbon/icons-react'
import React, { useContext } from 'react'
import { SocketContext } from '../../context/GlobalSocketContext'
import Message from '../Message/Message'
import "./_style.css"

function MeetChat() {
    const context = useContext(SocketContext)
    return (
        <div className="meetchat_area">
           <div className="meetchat__head">
               <div>
                  <Chat20></Chat20>
                  <h4>MeetChat</h4>
               </div>
               <Close20></Close20>
           </div>
           <hr color="#ededed"></hr>
           <div className="messages__area">
              {context.currMessages.map(m=>{
                  <Message key={m._id} message={m}/>
              })}
           </div>
        </div>
    )
}

export default MeetChat
