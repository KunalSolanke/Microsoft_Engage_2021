
import React, { useContext, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { SocketContext } from '../../context/GlobalSocketContext';

function CallVideo(props) {
     const ref = useRef();
    const context = useContext(SocketContext)
   

    useEffect(() => {
        if(props.peer.streams&&props.peer.streams.length>0){
                if(ref.current)ref.current.srcObject=props.peer.streams[0];
            }else {props.peer.on("stream", stream => {
                if(ref.current)ref.current.srcObject = stream;
                })
          }
    }, []);

    return (
       <video autoPlay playsInline ref={ref} className="videoplayer">
          
       </video>
    );
}

export default CallVideo

