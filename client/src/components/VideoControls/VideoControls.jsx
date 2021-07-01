import { Chat20, EventsAlt20, FaceActivated20, FaceActivatedAdd20, MicrophoneFilled20, MicrophoneOffFilled20, PhoneBlockFilled20, Share20,VideoFilled20, VideoOffFilled20 } from '@carbon/icons-react'
import React, { useContext, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { SocketContext } from '../../context/GlobalSocketContext';
import * as actionTypes from "../../store/constants/socket"
import "./_style.css"


function VideoControls() {
    const [videoOn, setVideoOn] = useState(true)
    const [audioOn, setaudioOn] = useState(true)
    const meet = useSelector(state=>state.socket.meet);
    const context = useContext(SocketContext)
    const userVideoStream = useSelector(state=>state.socket.userVideoStream);
    const dispatch = useDispatch()

    const handleVideoOff = (e)=>{
       if(userVideoStream)userVideoStream.getVideoTracks()[0].enabled=true;
        setVideoOn(true);
        dispatch({
            type:actionTypes.SET_USER_VIDEO,
            payload:userVideoStream
        })
    }
    const handleVideoOn = (e)=>{
        if(userVideoStream)userVideoStream.getVideoTracks()[0].enabled=false;
        setVideoOn(false);
        dispatch({
            type:actionTypes.SET_USER_VIDEO,
            payload:userVideoStream
        })
        
    }
    const handleAudioOn = (e)=>{
        if(userVideoStream)userVideoStream.getAudioTracks()[0].enabled=false;
        setaudioOn(false);
        dispatch({
            type:actionTypes.SET_USER_VIDEO,
            payload:userVideoStream
        })
    }
    const handleAudioOff = (e)=>{
        if(userVideoStream)userVideoStream.getAudioTracks()[0].enabled=true;
        setaudioOn(true);
        dispatch({
            type:actionTypes.SET_USER_VIDEO,
            payload:userVideoStream
        })
    }

    const shareLink = (e)=>{
         prompt(
    "Copy this link and send it to people you want to meet with",
    window.location.href
  );
    }

    const openPeople = (e)=>{dispatch({
        type:actionTypes.PEOPLE_ACTIVE
    })}

    const openChat = (e)=>{dispatch({
        type:actionTypes.CHAT_ACTIVE
    })}

    const leaveMeet = (e)=>{
       context.leaveCall()
    }

    return(
        <div className="video__controls">
            <div>
            
            {videoOn?<VideoFilled20 onClick={e=>handleVideoOn(e)}/>:
            <VideoOffFilled20 onClick={e=>handleVideoOff(e)}/>}
            </div>
            <div>

            {audioOn?<MicrophoneFilled20 onClick={e=>handleAudioOn(e)}/>:
            <MicrophoneOffFilled20 onClick={e=>handleAudioOff(e)}/>}
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