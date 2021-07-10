import React, { useEffect, useRef } from 'react'
import { useSelector } from 'react-redux';
import BotMessage from '../../components/Message/BotMessage';
import Message from '../../components/Message/Message'
/**
 * UserChatArea
 * show curr chat messages
 * @component
 */
function UserChatArea({HI}) {
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
       <>{messages
        &&messages.length==0?(
            <>
               <div className="chat_empty_state">
                   <div>
                   <p>Start conversation...</p>
                   <img src={HI}/>
                   </div>
               </div>
            </>
        ):
        (<div className="userchat__area">
                         <div className="chat__messages__area" ref={messageEl}>
                              {messages.map(m=>{
                                return <>{m.is_bot?<BotMessage key={m._id} message={m}/>:<Message key={m._id} message={m}/>}</>
                            })}

                        </div>          
        </div>)
                        }</>
    )
}

export default UserChatArea
