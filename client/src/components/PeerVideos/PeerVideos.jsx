import React, { useContext, useEffect, useState } from 'react'
import { Column, Row } from 'carbon-components-react'
import CallVideo from '../CallVideo/CallVideo'
import { SocketContext } from '../../context/GlobalSocketContext'
// import useSelectors from '../../hooks/useSelector'
import { useSelector } from 'react-redux'


function PeerVideos() {

    const context = useContext(SocketContext)
    const peers= useSelector(state => state.socket.peers)
     const [colLg, setcolLg] = useState(6)
     
    useEffect(()=>{
      if(peers.length>4)setcolLg(4);
      else setcolLg(6)
    },[peers])

    useEffect(()=>{
         if (context.userVideoRef.current){
            context.userVideoRef.current.srcObject = context.userVideoStream;
         }
    },[colLg])

    return (
         <Row className="video__row">
            <Column md={4} sm={4} lg={colLg} className="video__col">
                <video autoPlay playsInline ref={context.userVideoRef} className="videoplayer mine">
                </video>
            </Column>
            {peers.map((peerObj,i)=>(
            <Column md={4} sm={4} lg={colLg} key={peerObj.peerID} className="video__col">
                <CallVideo peer={peerObj.peer}/>
            </Column>))}
        </Row>
    )
}

export default PeerVideos
