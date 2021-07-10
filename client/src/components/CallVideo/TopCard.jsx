
import { AddFilled16, AddFilled20, Microphone16, MicrophoneFilled16, MicrophoneFilled20, MicrophoneOff16, MicrophoneOffFilled16, MicrophoneOffFilled20, Pin16, PinFilled16, Undo16, UserAvatar16, UserAvatar20, VideoChat16, VideoChat20, VideoOffFilled16, VideoOffFilled20 } from '@carbon/icons-react';
import { Column } from 'carbon-components-react';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { SocketContext } from '../../context/GlobalSocketContext';
import { addUsertoDeck } from '../../store/actions/socket';
import "./_styles.css"

/**
 *Topbar card component,when some is pinned or deck is full users are listed
 in the topBase
 @component 
 *
 */
function TopCard({peerObj}) {
    const ref = useRef();
    const peerStream= useSelector(state => state.socket.peerStreams.find(p=>p.peerID==peerObj.peerID))
    const userID = useSelector(state=>state.auth.userID);

    useEffect(()=>{
      if(peerStream&&ref.current)ref.current.srcObject=peerStream.stream;
    },[peerStream])

    const checkVideo = ()=>{
        return (peerStream&&peerStream.stream&&
            peerStream.stream.active
            &&peerStream.stream.getVideoTracks()[0]?.enabled&&
            !(peerStream.videoPaused)
        )
    }

    const checkAudio = ()=>{
        
        return (peerStream&&peerStream.stream&&
            peerStream.stream.active
            &&peerStream.stream.getAudioTracks()[0]?.enabled&&
            (!peerStream.muted)
        )

    }
   const dispatch = useDispatch()
    const checkUser = ()=>{
        return (
            peerObj&&peerObj.user&&peerObj.user.image
        );
    }

    const addtoDeck = ()=>{
        dispatch(addUsertoDeck(peerObj.peerID))
        
    }

    return (
        <div key={peerObj.peerID} className="video__col__card">
            <p style={{color:"white"}}>{
                peerObj?.peerID==userID?"You":peerObj?.user?.username
            }</p>
            <div className="peer__video__card">
                {checkVideo()?<div className="user__tile__card">
                    <video autoPlay playsInline ref={ref} className="videoplayer__card"
                muted={peerObj.peerID==userID}/></div>:
                    <div className="user__tile__card">
                        {
                                    checkUser()?(<img src={peerObj?.user?.image} className="user__avatar__card"/>):
                                    (<UserAvatar16 className="user__avatar__card"/>)
                        }
                    </div>
                }
                <div className="user_video_gizmo__card user__gizmos__active">
                    <AddFilled16 onClick={()=>addtoDeck()}/>
                </div>
            </div>
        </div>
    );
}

export default TopCard

