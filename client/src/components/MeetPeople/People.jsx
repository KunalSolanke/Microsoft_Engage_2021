import { UserAvatar16 } from '@carbon/icons-react';
import React from 'react'
import { useSelector } from 'react-redux';
import "./_style.css"

function People(props) {
   const me = useSelector(state => state.auth.userID)
   const renderUserProfile = ()=>{
       let user= props.user;
       if(user&&user.image)return (
           <>
           <img src={user.image} className="user__profile"/>
           </>
       )
       return  (<UserAvatar16 className="user__profile"/>)
   } 
   return (
        <div className="message__wrapper">
           <div className={"message__block "}>
                {renderUserProfile()}
                <div className={"message__main user"}>
                    <div className="message__head">
                        <p style={{fontSize:"0.8rem"}}>{me==props.user._id?"You":props.user.username}</p>
                    </div>
                </div>
            </div>           
        </div>
    )
}

export default People
