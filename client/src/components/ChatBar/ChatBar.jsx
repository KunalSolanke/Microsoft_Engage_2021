import { Chat20 } from '@carbon/icons-react'
import React from 'react'
import ChatTile from './ChatTile'
import "./_styles.css"

function ChatBar() {
    return (
        <div style={{"height":"100%"}} className="chatbar">
          <div className="chatbar__head">
              <Chat20></Chat20>
             <h5>Chat</h5>
          </div>
          <hr color="#ededed"/>
          <div className="chattiles__area">
             <ChatTile/>
             <ChatTile/>

             <ChatTile/>

             <ChatTile/>
             <ChatTile/>
             <ChatTile/>
             <ChatTile/>
             <ChatTile/>
             <ChatTile/>
             <ChatTile/>
             <ChatTile/>
             <ChatTile/>
             <ChatTile/>
             <ChatTile/>
             <ChatTile/>
             <ChatTile/>
             <ChatTile/>

          </div>
            
        </div>
    )
}

export default ChatBar
