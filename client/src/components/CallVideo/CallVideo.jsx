
import React, { useContext, useEffect, useRef } from 'react';
import { SocketContext } from '../../context/GlobalSocketContext';

function CallVideo(props) {
     const ref = useRef();
    const context = useContext(SocketContext)
    useEffect(() => {
        if(!props.mine){
            props.peer.on("stream", stream => {
            ref.current.srcObject = stream;
        })
    }
    }, []);

    return (
       <video autoPlay playsInline ref={props.mine?context.userVideoStream:ref} className="videoplayer">
          
       </video>
    );
}

export default CallVideo

