import React, { useEffect, useRef } from 'react'
import { useSelector } from 'react-redux';
import Message from '../../components/Message/Message'

function UserChatArea() {
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
                             <Message message={{content:"Hello there",author:{_id:1,username:"mew"}}}/>
                             <Message message={{content:"Hello there",author:{_id:1,username:"mew"}}}/>
                             <Message message={{content:"Hello there",author:{_id:1,username:"mew"}}}/>
                             <Message message={{content:"Hello there",author:{_id:1,username:"mew"}}}/>
                             <Message message={{content:"Hello there",author:{_id:1,username:"mew"}}}/>
                             <Message message={{content:"Hello there",author:{_id:1,username:"mew"}}}/>
                             <Message message={{content:"Hello there",author:{_id:1,username:"mew"}}}/>
                             <Message message={{content:"Hello there",author:{_id:1,username:"mew"}}}/>
                             <Message message={{content:"Hello there",author:{_id:1,username:"mew"}}}/>
                             <Message message={{content:"Hello there",author:{_id:1,username:"mew"}}}/>
                             <Message message={{content:"Hello there",author:{_id:1,username:"mew"}}}/>
                             <Message message={{content:"Hello there",author:{_id:1,username:"mew"}}}/>
                             <Message message={{content:"Hello there",author:{_id:1,username:"mew"}}}/>
                             <Message message={{content:"Hello there",author:{_id:1,username:"mew"}}}/>
                             <Message message={{content:"Hello there",author:{_id:1,username:"mew"}}}/>
                             <Message message={{content:"Hello there",author:{_id:1,username:"mew"}}}/>
                             <Message message={{content:"Hello there",author:{_id:1,username:"mew"}}}/>
                             <Message message={{content:"Hello there",author:{_id:1,username:"mew"}}}/>

                        </div>          
        </div>
    )
}

export default UserChatArea
