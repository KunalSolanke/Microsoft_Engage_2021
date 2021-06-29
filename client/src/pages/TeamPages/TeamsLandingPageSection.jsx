import { Button } from 'carbon-components-react'
import React from 'react'
import channelImage from "../../assets/images/channels.svg"
import teamsImage from "../../assets/images/teams.svg"

function TeamsLandingPageSection({setOpen}) {
    return (
        <div className="userchat__area">
            <div style={{display:"grid",placeItems:"center"}}>
                <h3>Welcome to the team</h3>
                <p>Here are somethings to start with ...</p>
                <div className="teams_landing_head">
                    <img src={channelImage} />
                    <img src={teamsImage}/>
                </div>
                <div className="teams_landing_cta">
                    <Button kind="danger--tertiary" size="sm" onClick={()=>setOpen(true)}>CreateChannel</Button>
                    &nbsp;<Button kind="primary" size="sm">Invite users</Button>
                </div>
            </div>
        </div>
    )
}

export default TeamsLandingPageSection
