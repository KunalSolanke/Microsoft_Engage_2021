import { UserAvatar16 } from '@carbon/icons-react';
import React from 'react'
import { useSelector } from 'react-redux';
import "./_style.css"

function Message({message}) {
   const me = useSelector(state => state.auth.userID)
   const renderUserProfile = ()=>{
       if(me==message.author._id)return null;
       let user= message.author;
       if(user&&user.image)return (
           <>
           <img src={user.image} className="user__profile"/>
           </>
       )
       return  (<UserAvatar16 className="user__profile"/>)
   } 
   return (
        <div className="message__wrapper">
           <div className={"message__block "+(me!=message.author._id?"left":"right")}>
                {renderUserProfile()}
                <div className={"message__main "+(me!=message.author._id?"user":"mymessage")}>
                    {me!=message.author._id?(<div className="message__head">
                        <p style={{fontSize:"0.8rem"}}>{message?.author?.username}</p>
                        <p>{message?.created_at}</p>
                    </div>):null}
                    <p style={{padding:"0rem 0.3rem"}}>{message?.content}</p>
                </div>
            </div>           
        </div>
    )
}

export default Message
