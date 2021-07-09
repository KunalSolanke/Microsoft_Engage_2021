import React, { useContext, useEffect, useState } from 'react'
import { Column, Row } from 'carbon-components-react'
import CallVideo from '../CallVideo/CallVideo'
import { SocketContext } from '../../context/GlobalSocketContext'
// import useSelectors from '../../hooks/useSelector'
import { useSelector } from 'react-redux'
import UserVideo from '../CallVideo/UserVideo'
import VideoControls from '../VideoControls/VideoControls'
import TopBar from "./TopBar"

function PeerVideos() {

    const context = useContext(SocketContext)
    const peers= useSelector(state => state.socket.peers)
    const deckPeers = peers.filter(p=>p.onDeck);
    const topPeers = peers.filter(p=>!p.onDeck);
    
    return (
         <>
           {/* {topPeers&&topPeers.length>0?<Row>
               <Column>
                 <TopBar topPeers={topPeers}/>
               </Column>
           </Row>:null} */}
           <Row>
               <Column>
                 <TopBar topPeers={topPeers}/>
               </Column>
           </Row>
            <Row className="video__row">
                {deckPeers.map((peerObj,i)=>(
                    <CallVideo peerObj={peerObj} key={peerObj.peerID}/>))}
            </Row>
            <Row>
                    <Column className="videocontrols__wrapper">
                        <VideoControls/>
                    </Column>
            </Row>
        </>
    )
}

export default PeerVideos
