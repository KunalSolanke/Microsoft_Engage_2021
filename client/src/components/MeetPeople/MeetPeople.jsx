import { Chat20, Close20, EventsAlt20 } from '@carbon/icons-react'
import React, { useContext, useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import * as actionTypes from "../../store/constants/socket"
import People from './People'
import "./_style.css"

function MeetPeople() {
    const peers= useSelector(state => state.socket.peers)
    const dispatch = useDispatch()
    const openChat = (e)=>{dispatch({
        type:actionTypes.PEOPLE_ACTIVE
        })}
    return (
        
        <div className="meetchat_area">
           <div className="meetchat__head">
               <div>
                  <EventsAlt20  className="meet__chat__icon"/>
                  <h5>People</h5>
               </div>
               <Close20 onClick={e=>openChat(e)}></Close20>
           </div>
           <hr color="#ededed"></hr>
           <div className="messages__area">
              {peers.map(m=>{
                  return <People key={m.user._id} user={m.user}/>
              })}
             
           </div>
        </div>
    )
}

export default MeetPeople
