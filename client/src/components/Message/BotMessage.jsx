import { MachineLearning16, Reply16, UserAvatar16 } from '@carbon/icons-react';
import React from 'react'
import { useHistory } from 'react-router-dom';
import { format, formatDistance, formatRelative, subDays } from 'date-fns'

import "./_style.css"

/**
 * Bot message component is used to show the 
 * meet started messages or similar messages
 * @component
 */
function BotMessage({message}) {
    const history=useHistory()
    return (
        <div className="channel__message__wrapper">
           <div className="message__block">
                <MachineLearning16/>
                <div className="channel_message_main" style={{marginLeft:"1rem"}}>
                    <div>
                    <div style={{display:"flex",justifyContent:"space-between"}}>
                        <p style={{fontSize:"0.8rem",padding:"0rem 0.1rem"}}>Connect Bot</p>
                        <p style={{fontSize:"0.8rem"}}>{formatDistance(new Date(message?.createdAt), new Date(), { addSuffix: true })}</p>

                    </div>
                    <p style={{padding:"0rem 0.1rem"}}>{message.content}</p>
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
