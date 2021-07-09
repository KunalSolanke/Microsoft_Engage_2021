import { UserAvatar16 } from '@carbon/icons-react'
import React from 'react'
import { useSelector } from 'react-redux'
import {useHistory, useParams} from "react-router-dom"

function ChatTile(props) {
    const history = useHistory()
    const {chatID} = useParams()
    const userID= useSelector(state => state.auth.userID)
    const user = props.chat.participants[0]._id==userID?props.chat.participants[1]:props.chat.participants[0]
    const handleOnClick = e=>{history.push(`/dashboard/chat/${props.chat._id}`)}
    return (
        <div className={"chat__tile"+(chatID==props.chat._id?" white":"")} onClick={e=>handleOnClick()}>
            {user&&user.image? <>
                <img src={user.image} className="user__profile"/>
                </>
            :(<UserAvatar16 className="user__profile"/>)}
            <div className="chattile__content">
                <h6 style={{marginBottom:"0.4rem"}}>{user?.username}</h6>
            {chatID!=props.chat._id?
            <p>
                {props.last_message?<>{props.last_message?.slice(0,20)}...</>:<>No new message</>}
            </p>:<p>Current</p>
            }
            </div>
        </div>
    )
}

export default ChatTile
