import { Reply16, UserAvatar16 } from '@carbon/icons-react';
import React from 'react'
import "./_style.css"
import { format, formatDistance, formatRelative, subDays } from 'date-fns'

/**
 * Channel message component is used to show the 
 * message inside team channel
 * @component
 */

function ChannelMessage({message}) {
    /**
    * Render the user profile based on users image or 
    * author
    */
    const renderUserProfile = ()=>{
       let user= message.author;
       if(user&&user.image)return (
           <>
           <img src={user.image} className="user__profile"/>
           </>
       )
       return  (<UserAvatar16 className="user__profile"/>)
   } 
    return (
        <div className="channel__message__wrapper">
           <div className="message__block">
                {renderUserProfile()}
                <div className="channel_message_main">
                    <div>
                    <div>
                        <p style={{fontSize:"0.8rem",padding:"0rem 0.1rem"}}>{message?.author?.username}</p>
                        <p style={{fontSize:"0.8rem"}}>{formatDistance(new Date(message?.createdAt), new Date(), { addSuffix: true })}</p>
                    </div>
                    <p style={{padding:"0rem 0.3rem"}}>{message?.content}</p>

                    </div>
                    <div className="channel__message__foot">
                    <Reply16></Reply16>
                    <p>Reply</p>
              </div>      
                </div>
            </div> 
        </div>
    )
}

export default ChannelMessage
