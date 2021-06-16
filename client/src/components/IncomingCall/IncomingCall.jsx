import { PhoneBlock24, PhoneIncoming24, UserProfile24 } from '@carbon/icons-react'
import React from 'react'
import "./_style.css"

function IncomingCall({user}) {
    return (
        <div className="incoming__call">
            <div className="head">
              <p>Incoming Call from {user?.username}</p>
            </div>     
            {
                    user&&user.image?(<img src={user.image} className="user__avatar"/>):
                    (<UserProfile24 className="user__avatar"/>)
            }
            <div class="call__actions">
                <div className="accept_button">
                  <PhoneIncoming24/>
                </div>
                <div className="decline_button">
                   <PhoneBlock24/>
                </div>
            </div>
        </div>
    )
}

export default IncomingCall
