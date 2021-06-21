
import React, { useContext, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { SocketContext } from '../../context/GlobalSocketContext';

function UserVideo(props) {
   const ref = useRef();
   const userVideo = useSelector(state => state.socket.userVideoStream)
   
   useEffect(() => {
       if(ref.current)ref.current.srcObject=userVideo;
    }, [userVideo]);

    return (
       <video autoPlay playsInline ref={ref} className="videoplayer">
          
       </video>
    );
}

export default UserVideo

