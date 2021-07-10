import { Button, Content } from 'carbon-components-react'
import React from 'react'
import DashboardLayout from '../../layouts/DashboardLayout/DashboardLayout'
import "./_styles.css"
import {Carousel} from "react-responsive-carousel"
import chatGall from "../../assets/images/chat_gall.jpg"
import group from "../../assets/images/group.jpg"
import vChat from "../../assets/images/video_chat.jpg"
import { useHistory } from 'react-router-dom'

/**
 *Dashboard main area
 * @component
 */
function DashboardMain() {
    const history = useHistory()
    return (
        <DashboardLayout>

            <Content
            id="main-content"
            className="main__dash">
                <Carousel showArrows={false} autoPlay={true}  infiniteLoop={true}showIndicators={false}
                showThumbs={false} >
                <div>
                    <img src={chatGall} />
                    <p style={{marginBottom:"1rem"}}>Add your friends to your contact list and have hassle free <br/>messaging anytime.</p>
                                  <Button kind="danger--tertiary" onClick={()=>history.push("/dashboard/chat")}>Contacts</Button>
                </div>
                <div>
                    <img src={vChat} />
                    <p style={{marginBottom:"1rem"}}>Video chat with friends with in meet chat.</p>
                   <Button kind="danger--tertiary" onClick={()=>history.push("/dashboard/meet")}>Video Chat</Button>
                </div>
                <div>
                    <img src={group} />
                    <p style={{marginBottom:"1rem"}}>Create teams  and enjoy <br/>messaging anytime.</p>
                    <Button kind="danger--tertiary" onClick={()=>history.push("/dashboard/teams")}>Teams</Button>
                </div>
            </Carousel>
            
        </Content>
        </DashboardLayout>
    )
}

export default DashboardMain
