import { Column } from 'carbon-components-react'
import React from 'react'
import { useSelector } from 'react-redux'
import MeetChat from '../../components/MeetChat/MeetChat'
import MeetPeople from '../../components/MeetPeople/MeetPeople'

/**
 * MeetSidebar
 * display chat/people sidebar based on global state
 * @component
 */
function MeetSidebar() {
    const isChatActive = useSelector(state=>state.socket.isChatActive)
    const isPeopleActive = useSelector(state=>state.socket.isPeopleActive)
    return (
        <>
            {isChatActive?<Column  sm={4} md={2} lg={3} className="chatbox"  >
                           <MeetChat/>
                       </Column>:null}
            {isPeopleActive?          <Column sm={4} md={2} lg={3} className="chatbox">
                           <MeetPeople/>
            </Column>:null}
        </>
    )
}

export default MeetSidebar
