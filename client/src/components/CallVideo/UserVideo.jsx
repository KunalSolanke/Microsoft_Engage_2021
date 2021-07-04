
import { UserAvatar20 } from '@carbon/icons-react';
import React, { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';

function UserVideo(props) {
   const ref = useRef();
   const userVideo = useSelector(state => state.socket.userVideoStream)
    const isChatActive = useSelector(state=>state.socket.isChatActive)
    const isPeopleActive = useSelector(state=>state.socket.isPeopleActive)
    const user = useSelector(state=>state.auth.profile)
    const audioState = useSelector(state=>state.socket.audioPaused)
    const videoState = useSelector(state=>state.socket.videoPaused)

   
   useEffect(() => {
       if(ref.current)ref.current.srcObject=userVideo;
    }, [userVideo,isPeopleActive,isChatActive,audioState,videoState]);

    return (
       <div className="peer__video">
       {userVideo&&userVideo.active&&videoState?<video autoPlay playsInline ref={ref} className="videoplayer"/>:
       <div className="user__tile">
           {
                    user&&user.image?(<img src={user.image} className="user__avatar"/>):
                    (<UserAvatar20 className="user__avatar"/>)
            }
       </div>
       }
       </div>
    );
}

export default UserVideo

