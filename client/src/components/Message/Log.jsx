import { Activity16 } from '@carbon/icons-react';
import React from 'react'
import "./_style.css"
function Log({log}) {
    return (
        <div className="activity__message__wrapper">
           <Activity16/>
           <div className="activity__message__block">
                <div className="activity__log__main" style={{marginLeft:"1rem"}}>
                    <div>
                    <div>
                        <p style={{fontSize:"0.8rem",padding:"0rem 0.3rem"}}>Connect Bot</p>
                    </div>
                    <p>{log}</p>
                    </div>
                </div>
            </div> 
        </div>
    )
}

export default Log
