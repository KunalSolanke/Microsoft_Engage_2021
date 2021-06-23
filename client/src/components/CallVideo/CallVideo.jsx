
import React, { useContext, useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { SocketContext } from '../../context/GlobalSocketContext';

function CallVideo(props) {
    const ref = useRef();
    const [currUserStream, setcurrUserStream] = useState(null)
    const peerStreams= useSelector(state => state.socket.peerStreams)
    // useEffect(() => {
    //     console.log("CallVideo mount ...")
    //     props.peer.on("stream", stream => {
    //         console.log("Gettig user stream", stream)
    //         setcurrUserStream(stream)
    //         if (ref.current) ref.current.srcObject = stream;
    //     })
    // }, []);
    useEffect(()=>{
        console.log(peerStreams)
      let peerStream = peerStreams.find(p=>p.peerID==props.peerID)
      if(peerStream)setcurrUserStream(peerStream.stream)
    },[peerStreams])

    useEffect(()=>{
        console.log(currUserStream)
        if(currUserStream&&ref.current&&ref.current.srcObject==null)ref.current.srcObject=currUserStream;
        console.log(ref)
    },[currUserStream])

    return (
        <video autoPlay playsInline ref={ref} className="videoplayer" key={props.peerID}>

        </video>
    );
}

export default CallVideo

