import { PhoneBlock24, PhoneBlockFilled24, PhoneIncoming24, PhoneIncomingFilled24, UserAvatar20, UserProfile24 } from '@carbon/icons-react'
import React, { useContext } from 'react'
import { SocketContext } from '../../context/GlobalSocketContext'
import "./_style.css"

/**
 * Incoming call tile.
 * This component pops up when there is a call 
 */
function IncomingCall({user}) {
    const context = useContext(SocketContext)
    return (
        <div className="incoming__call">
            <div className="head">
              <p>Incoming Call from {user?.username}</p>
            </div>     
            {
                    user&&user.image?(<img src={user.image} className="user__avatar"/>):
                    (<UserAvatar20 className="user__avatar"/>)
            }
            <div class="call__actions">
                <div className="accept_button" onClick={(e)=>{ console.log("answer")
                  context.answerCall()}}>
                  <PhoneIncomingFilled24  />
                </div>
                <div className="decline_button"  onClick={(e)=>context.rejectCall()}>
                   <PhoneBlockFilled24 color="white"/>
                   
                </div>
            </div>
        </div>
    )
}

export default IncomingCall
