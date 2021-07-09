import { Button } from 'carbon-components-react'
import React from 'react'
import channelImage from "../../assets/images/channels.svg"
import teamsImage from "../../assets/images/teams.svg"

function TeamsLandingPageSection({setOpen}) {
     const shareLink = (e)=>{
         prompt(
    "Copy this link and send it to people you want to invite",
    window.location.href+"/join"
  );
     }
    return (
        <div className="userchat__area teams__landing__main">
            <div style={{display:"grid",placeItems:"center"}}>
                <h3>Welcome to the team</h3>
                <p>Here are somethings to start with ...</p>
                <div className="teams_landing_head">
                    <img src={channelImage} />
                    <img src={teamsImage}/>
                </div>
                <div className="teams_landing_cta">
                    <Button kind="danger--tertiary" size="sm" onClick={()=>setOpen(true)}>CreateChannel</Button>
                   <Button kind="primary" size="sm" onClick={()=>shareLink()}>Invite users</Button>
                </div>
            </div>
        </div>
    )
}

export default TeamsLandingPageSection
