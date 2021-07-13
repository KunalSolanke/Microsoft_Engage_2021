import { UserAvatar16 } from '@carbon/icons-react'
import React from 'react'

import {useHistory, useParams} from "react-router-dom"

/**
 *TeamChannelTile
 Displays all the channels inside given meet
 @component

 */
function TeamChannelTile({channel}) {
    const history = useHistory()
    const {channelID} = useParams()
    const handleOnClick = e=>{history.push(`/dashboard/channels/${channel._id}`)}
    return (
        <div className={"chat__tile"+(channelID==channel._id?" white":"")} onClick={e=>handleOnClick()}>
            <div className="chattile__content">
                <p style={{fontSize:"0.8rem"}}>{channel?.channel_name}</p>
            </div>
        </div>
    )
}

export default TeamChannelTile
