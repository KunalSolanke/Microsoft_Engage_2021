import { Activity16 } from '@carbon/icons-react';
import React from 'react'
import "./_style.css"
import { format, formatDistance, formatRelative, subDays } from 'date-fns'
/**
 * Log component show user activity log
 * @component
 */
function Log({log}) {
    return (
        <div className="activity__message__wrapper">
           <Activity16/>
           <div className="activity__message__block">
                <div className="activity__log__main" style={{marginLeft:"1rem"}}>
                    <div>
                    <div style={{display:"flex",justifyContent:"space-between"}}>
                        <p style={{fontSize:"0.8rem",padding:"0rem 0.1rem"}}>Connect Bot</p>
                        <p style={{fontSize:"0.8rem"}}>{formatDistance(new Date(log?.createdAt), new Date(), { addSuffix: true })}</p>
                    </div>
                    <p>{log.log}</p>
                    </div>
                </div>
            </div> 
        </div>
    )
}

export default Log
