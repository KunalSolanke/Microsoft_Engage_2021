import { UserAvatar16 } from '@carbon/icons-react'
import React from 'react'

function ChatTile(props) {
    return (
        <div className="chat__tile">
            {props.user&&props.user.image? <>
                <img src={user.image} className="user__profile"/>
                </>
            :(<UserAvatar16 className="user__profile"/>)}
            <div className="chattile__content">
                <h6 style={{marginBottom:"0.4rem"}}>Percy Jackson</h6>
                <b>New message.....</b>
            </div>
        </div>
    )
}

export default ChatTile
