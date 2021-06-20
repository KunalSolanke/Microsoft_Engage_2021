import { PhoneBlock24, PhoneBlockFilled24, UserAvatarFilled20 } from '@carbon/icons-react'
import { Content } from 'carbon-components-react'
import React, { useContext } from 'react'
import { Prompt } from 'react-router-dom'
import { SocketContext } from '../../context/GlobalSocketContext'
import DashboardLayout from '../../layouts/DashboardLayout/DashboardLayout'
import "./_style.css"

function CreateCall() {
    const context = useContext(SocketContext)
    const render = ()=>{
        if(context.callAboarted){
            return <h3 style={{color:"white"}}>Call was aboarted please try again</h3>
        }
        if(context.callTo==null){
            return <h3  style={{color:"white"}}>Please select a user from search page to call....</h3>
        }
        return ( <><h3 className="head__call">Calling {context.callTo?.username}</h3>
                    {
                    context.callTo&&context.callTo.image?(<img src={context.callTo.image} className="user__avatar"/>):
                    (<UserAvatarFilled20 className="user__avatar"/>)
                  }
                   <div class="make_call__actions">
                        <div className="decline_button">
                        <PhoneBlockFilled24 onClick={(e)=>context.rejectCall()}/>
                        </div>
                    </div></>)
    }
    return (
        <DashboardLayout>
           <Content
              id="main-content"
              className="dashboard_main_area dark"
           >
               <Prompt
                    message={(location, action) => {
                    if (action === 'POP') {
                        console.log("Backing up...")
                        context.reinitialize();
                    }

                    return true;
                    }}
                    />
               <div className="calling__user">
                {render()}
               </div>
               
            </Content>
        </DashboardLayout>
    )
}

export default CreateCall
