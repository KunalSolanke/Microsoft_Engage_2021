import React, { useEffect, useRef } from 'react'
import { useSelector } from 'react-redux';
import ChannelMessage from '../../components/Message/ChannelMessage';

function TeamChatArea() {
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
       <div className="userchat__area">
                         <div className="chat__messages__area" ref={messageEl}>
                              {messages.map(m=>{
                                return <ChannelMessage key={m._id} message={m}/>
                            })}

                        </div>          
        </div>
    )
}

export default TeamChatArea
