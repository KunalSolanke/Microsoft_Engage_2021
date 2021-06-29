import { MachineLearning16, Reply16, UserAvatar16 } from '@carbon/icons-react';
import React from 'react'
import { useHistory } from 'react-router-dom';
import "./_style.css"
function BotMessage({message}) {
    const history=useHistory()
    return (
        <div className="channel__message__wrapper">
           <div className="message__block">
                <MachineLearning16/>
                <div className="channel_message_main" style={{marginLeft:"1rem"}}>
                    <div>
                    <div>
                        <p style={{fontSize:"0.8rem",padding:"0rem 0.3rem"}}>Connect Bot</p>
                        <p>{message?.created_at}</p>
                    </div>
                    <p style={{padding:"0rem 0.3rem"}}>{message.content}</p>
                    </div>
                    {message?.meet&&(
                    <div className="channel__message__foot" onClick={()=>history.push(`/dashboard/meet/${message.meet}`)} style={{cursor:"pointer"}}>
                    <Reply16></Reply16>
                    <p>Join Meet</p>
                  </div>)}     
                </div>
            </div> 
        </div>
    )
}

export default BotMessage
