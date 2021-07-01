import React, { useContext, useEffect, useState } from 'react'
import { Column, Row } from 'carbon-components-react'
import CallVideo from '../CallVideo/CallVideo'
import { SocketContext } from '../../context/GlobalSocketContext'
// import useSelectors from '../../hooks/useSelector'
import { useSelector } from 'react-redux'
import UserVideo from '../CallVideo/UserVideo'


function PeerVideos() {

    const context = useContext(SocketContext)
    const peers= useSelector(state => state.socket.peers)
     const [colLg, setcolLg] = useState(6)
     
    useEffect(()=>{
      if(peers.length>4)setcolLg(5);
      else setcolLg(8)
    },[peers])

    return (
         <Row className="video__row">
            <Column md={4} sm={4} lg={colLg} className="video__col">
                <p style={{color:"white"}}>You</p>
               <UserVideo/>
            </Column>
            {peers.map((peerObj,i)=>(
            <Column md={4} sm={4} lg={colLg} key={peerObj.peerID} className="video__col">
                <p style={{color:"white"}}>{peerObj.user.username}</p>
                <CallVideo peerID={peerObj.peerID}/>
            </Column>))}
        </Row>
    )
}

export default PeerVideos