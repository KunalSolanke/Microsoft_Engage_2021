import React, { useEffect, useRef } from 'react'
import { useSelector } from 'react-redux';
import ChannelMessage from '../../components/Message/ChannelMessage';

/**
 * TeamChatArea
 * show team channels messages
 * @component
 */
function TeamChatArea() {
    const messageEl= useRef(null);
    const messages= useSelector(state => state.socket.currMessages)

    /**Scroll to bottom on new message */
    const scrollBottom =  event => {
        const { currentTarget: target } = event;
        target.scroll({ top: target.scrollHeight, behavior: 'smooth' });
      }
    
    /**Attack scroll to bottom event Listners */
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
