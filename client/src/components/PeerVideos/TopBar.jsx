import { Api20, ArrowLeft16, ArrowRight16, ArrowRight20, GroupPresentation20, Minimize20 } from '@carbon/icons-react'
import React from 'react'
import ScrollMenu from 'react-horizontal-scrolling-menu';
import { useDispatch, useSelector } from 'react-redux';
import * as actionTypes from "../../store/constants/socket"
import TopCard from '../CallVideo/TopCard';
import "./_styles.css"
const Arrow = ({ text, className }) => {
  return (
    <div
      className={className}
    >{text}</div>
  );
};


const ArrowLeft = Arrow({ text: '<', className: 'arrow-prev' });
const ArrowRight = Arrow({ text: '>', className: 'arrow-next' });

/**
 * Topbar
 * Top horizontal area meeting
 * @component
 */
function TopBar({topPeers}) {
    const topCards = topPeers.map(peerObj=>(
            <TopCard peerObj={peerObj} key={peerObj.peerID}/>
        ))
    const dispatch = useDispatch()
    /**Toggle user top bar */
    const handleClick=()=>{
      dispatch({
        type:actionTypes.TOGGLE_DECK
      })
    }
    const userDeckOn =useSelector(state=>state.socket.userDeckOn)

    return (
        <div style={{padding:"0rem 1rem"}}>
          <div onClick={()=>{
            handleClick()
          }} className="deck__open">
            {!userDeckOn?<GroupPresentation20/>:<Api20/>}
          </div>
          {userDeckOn?
            <ScrollMenu
            data={topCards}
            arrowLeft={ArrowLeft}
          arrowRight={ArrowRight}
            />:null}
        </div>
    )
}

export default TopBar
