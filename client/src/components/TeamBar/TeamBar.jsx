import { Add16, EventsAlt16 } from '@carbon/icons-react'
import React from 'react'

import {Button} from "carbon-components-react"
import TeamChannelTile from './TeamChannelTile';
import "./_styles.css"
import { useHistory } from 'react-router-dom';

function TeamBar({team,setOpen}) {
    const data = team?.channels||null;
    const history = useHistory()
    const getTilesArea = ()=>{
        
        if(data&&data.length){
            return (<>
            <p style={{paddingLeft:"1rem"}}>Channels</p>
            {data.map(tile=><TeamChannelTile channel={tile} key={tile._id}/>)}
            </>)
        }else{
            return (
                <>
                   <div className="tiles__empty_state">
                       <div>
                       <p>You don't any channels yet.Add more channels</p>
                       <Button isExpressive size="default" renderIcon={Add16} onClick={()=>setOpen(true)}>
                        Add
                        </Button>
                        </div>
                   </div>
                </>
            )
        }
    }
    return (
        <div style={{"height":"100%"}} className="chatbar teamsbar">
         <p style={{padding:"1rem",cursor:"pointer"}} onClick={()=>history.push("/dashboard/teams")}>Teams</p>
          <hr color="#ededed"/>
          <div className="chatbar__head" style={{cursor:"pointer"}} onClick={()=>history.push(`/dashboard/teams/${team._id}`)}>
              <EventsAlt16></EventsAlt16>
             <h6>{team?.channel_name}</h6>
          </div>
          <div className="chattiles__area">
            
             {getTilesArea()}
          </div>
            
        </div>
    )
}

export default TeamBar
