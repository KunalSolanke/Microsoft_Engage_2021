
import { Microphone16, MicrophoneFilled16, MicrophoneFilled20, MicrophoneOff16, MicrophoneOffFilled16, MicrophoneOffFilled20, Pin16, PinFilled16, PinFilled20, Undo16, Undo20, UserAvatar20, VideoChat20, VideoOffFilled20 } from '@carbon/icons-react';
import { Column } from 'carbon-components-react';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { SocketContext } from '../../context/GlobalSocketContext';
import { pinUser, unPinUser } from '../../store/actions/socket';
import "./_styles.css"

/**
 * This is ther user video compoent of meet page
 * @component
 * @param {*} peerObj
 */
function CallVideo({peerObj}) {
    const ref = useRef();
    const peerStream= useSelector(state => state.socket.peerStreams.find(p=>p.peerID==peerObj.peerID))
    const userID = useSelector(state=>state.auth.userID);
    const userDeckopen = useSelector(state=>state.socket.userDeckOn)

    useEffect(()=>{
      if(peerStream&&ref.current)ref.current.srcObject=peerStream.stream;
    },[peerStream])

    /**
     * Check is video stream is valid or not
     * by active trakcs and mediaState object of peer
     */
    const checkVideo = ()=>{
        return (peerStream&&peerStream.stream&&
            peerStream.stream.active
            &&peerStream.stream.getVideoTracks()[0]?.enabled&&
            !(peerStream.videoPaused)
        )
    }

    /**
     * Check is audio stream is valid or not
     * by active trakcs and mediaState object of peer
     */
    const checkAudio = ()=>{
        
        return (peerStream&&peerStream.stream&&
            peerStream.stream.active
            &&peerStream.stream.getAudioTracks()[0]?.enabled&&
            (!peerStream.muted)
        )

    }
    const dispatch = useDispatch()
    /**
     * check if user has proper image or not
     */
    const checkUser = ()=>{
        return (
            peerObj&&peerObj.user&&peerObj.user.image
        );
    }

    /**
     * user gizmos :pin unpin user
     */
    const pinPeer = ()=>{
        dispatch(pinUser(peerObj.peerID))
    }
    const unPinPeer = ()=>{
        dispatch(unPinUser(peerObj.peerID))
    }

    const handlePin = ()=>{
        if(peerObj.isPinned)unPinPeer();
        else pinPeer()

    }
    /**
     * set scale of userVideo based on the status of
     * peer
     * depending on if userBar is open or not,or if user
     * is pinned or not
     */
    let colLg = ()=>{
        if(peerObj.isPinned&&userDeckopen)return 12;
        else if(peerObj.isPinned)return 14;
        else return 7;
    }
    let colmd= ()=>{
        if(peerObj.isPinned&&userDeckopen)return 6;
        else if(peerObj.isPinned)return 7;
        else return 6;
    }
    return (
        <Column sm={4} md={colmd()} lg={colLg()} key={peerObj.peerID} className="video__col">
            <p style={{color:"white"}}>{
                peerObj?.peerID==userID?"You":peerObj?.user?.username
            }</p>
            <div className="peer__video">
                    {checkVideo()?<video autoPlay 
                    playsInline ref={ref} className={"videoplayer "+
                    (peerObj.isPinned?"pinned":"")
                    +(peerObj.isPinned&&userDeckopen?" pinned_deck":"")
                }
                    muted={peerObj.peerID==userID}/>:
                     <div className={"user__tile " + 
                            (peerObj.isPinned?"pinned":"")
                        +(peerObj.isPinned&&userDeckopen?" pinned_deck":"")
                        }>
                            {
                                        checkUser()?(<img src={peerObj?.user?.image} className="user__avatar"/>):
                                        (<UserAvatar20 className="user__avatar"/>)
                            }
                        </div>
                    }
                    <div className="user_video_gizmo user__gizmos__active" onClick={()=>{
                        handlePin()
                    }}>
                        {peerObj.isPinned?<Undo20 />:<PinFilled20/>}
                    </div>
                    <div className="media__state">
                        {checkAudio()?<MicrophoneFilled20/>:
                        <MicrophoneOffFilled20 className="media__off"/>}
                        {checkVideo()?<VideoChat20/>:<VideoOffFilled20 className="media__off"/>}
                    </div>
            </div>
        </Column>
    );
}

export default CallVideo

