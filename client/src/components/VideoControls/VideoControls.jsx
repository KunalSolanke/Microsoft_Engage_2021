import { Chat20, EventsAlt20, FaceActivated20, FaceActivatedAdd20, MicrophoneFilled20, MicrophoneOffFilled20, PhoneBlockFilled20, Screen20, ScreenOff20, Share20,VideoFilled20, VideoOffFilled20 } from '@carbon/icons-react'
import React, { useContext, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory, useParams } from 'react-router-dom';
import { SocketContext } from '../../context/GlobalSocketContext';
import { setmediaState } from '../../store/actions/socket';
import * as actionTypes from "../../store/constants/socket"
import "./_style.css"
/**
 * VideoControls
 * Display user video chat gizmos inside meet
 * @component
 */

function VideoControls() {
    const mediaState = useSelector(state => state.socket.mediaState)
    const screenOn = useSelector(state=>state.socket.screenOn);    
    const {meetID}= useParams()
    const context = useContext(SocketContext)
    const userVideoStream = useSelector(state=>state.socket.userVideoStream);
    const dispatch = useDispatch()
    const userID = useSelector(state=>state.auth.userID);
    const history = useHistory()
    /**start video */
    const handleVideoOff = (e)=>{
       if(userVideoStream)userVideoStream.getVideoTracks()[0].enabled=true;
       dispatch(setmediaState({videoPaused:false},userID,context.socket,meetID))
    }
    /**stop video */
    const handleVideoOn =()=>{
        if(userVideoStream)userVideoStream.getVideoTracks()[0].enabled=false;
	dispatch(setmediaState({videoPaused:true},userID,context.socket,meetID))
    }
    /**stop audio */
    const handleAudioOn = (e)=>{
        if(userVideoStream&&
        userVideoStream.getAudioTracks()[0])userVideoStream.getAudioTracks()[0].enabled=false;  
	dispatch(setmediaState({muted:true},userID,context.socket,meetID))
    }
    /**start audio */
    const handleAudioOff = (e)=>{
        if(userVideoStream
          &&userVideoStream.getAudioTracks()[0])userVideoStream.getAudioTracks()[0].enabled=true;
	dispatch(setmediaState({muted:false},userID,context.socket,meetID))
    }
    /**stop screen */
    const handleScreenOn = (e)=>{
        context.stopScreenShare();
      
    }
   /**start screen */
    const handleScreenOff = (e)=>{
        context.startScreenShare()
    }
    /**share link to users */
    const shareLink = (e)=>{
         prompt(
    "Copy this link and send it to people you want to meet with",
    window.location.href
  );
    }
    /**open meetpeople sidebar */
    const openPeople = (e)=>{dispatch({
        type:actionTypes.PEOPLE_ACTIVE
    })}
   /**open chat sidebar */
    const openChat = (e)=>{dispatch({
        type:actionTypes.CHAT_ACTIVE
    })}
   /**exit meet */
    const leaveMeet = (e)=>{
       history.push("/dashboard")
    }

    return(
        <div className="video__controls">
            <div>
            
            {!mediaState.videoPaused?<VideoFilled20 onClick={e=>handleVideoOn(e)}/>:
            <VideoOffFilled20 onClick={e=>handleVideoOff(e)}/>}
            </div>
            <div>

            {!mediaState.muted?<MicrophoneFilled20 onClick={e=>handleAudioOn(e)}/>:
            <MicrophoneOffFilled20 onClick={e=>handleAudioOff(e)}/>}
            </div>
            <div>

            {screenOn?<ScreenOff20 onClick={e=>handleScreenOn(e)}/>:
            <Screen20 onClick={e=>handleScreenOff(e)}/>}
            </div>
            <div onClick={(e=>openChat(e))}>

            <Chat20/>
            </div>
            <div onClick={(e)=>openPeople(e)}>

            <EventsAlt20/>
            </div>
            <div onClick={(e)=>shareLink(e)}>

            <FaceActivatedAdd20 />
            </div>
            <div className="end__call" onClick={e=>leaveMeet()}>

            <PhoneBlockFilled20 />
            </div>
        </div>
    )
}

export default VideoControls
