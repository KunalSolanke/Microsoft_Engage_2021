import { UserAvatar20 } from '@carbon/icons-react';
import React from 'react'
import "./_style.css"

function Message({message}) {
   const auth = useSelector(state => state.auth)
   const renderUserProfile = ()=>{
       if(auth.userID==message.author)return null;
       let user= author;
       if(user&&user.image)return (
           <>
           <img src={user.image} className="user__profile"/>
           </>
       )
       return  (<UserAvatar20 className="user__profile"/>)
   } 
   return (
        <div className="message__wrapper">
           <div className={"message__block "+(auth.userID!=author?"left":"right")}>
                {renderUserProfile()}
                <div className={"message__head "+(auth.userID!=author?"user":"mymessage")}>
                    <div className="message__head">
                        <p>{message.author.username}</p>
                        <p>{message.created_at}</p>
                    </div>
                    <p>{message.content}</p>
                </div>
            </div>           
        </div>
    )
}

export default Message
