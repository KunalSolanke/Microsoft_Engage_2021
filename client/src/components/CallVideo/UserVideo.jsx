
import React, { useContext, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { SocketContext } from '../../context/GlobalSocketContext';

function UserVideo(props) {
   const ref = useRef();
   const userVideo = useSelector(state => state.socket.userVideoStream)
      const isChatActive = useSelector(state=>state.socket.isChatActive)
    const isPeopleActive = useSelector(state=>state.socket.isPeopleActive)
   
   useEffect(() => {
       if(ref.current)ref.current.srcObject=userVideo;
    }, [userVideo,isPeopleActive,isChatActive]);

    return (
       <video autoPlay playsInline ref={ref} className="videoplayer">
          
       </video>
    );
}

export default UserVideo

