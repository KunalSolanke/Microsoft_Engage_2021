import { Column, Content, Grid, Row } from 'carbon-components-react'
import React, { useContext, useEffect, useState } from 'react'
import DashboardLayout from '../../layouts/DashboardLayout/DashboardLayout'
import "./_styles.css"
import { UserSimulation16, Workspace20 } from '@carbon/icons-react'
import { SocketContext } from '../../context/GlobalSocketContext'
import { useParams } from 'react-router-dom'
import * as actionTypes from "../../store/constants/socket"
import { useDispatch, useSelector } from 'react-redux'
import UserChatArea from '../ChatPage/UserChatArea'
import TeamBar from '../../components/TeamBar/TeamBar'
import useFetchTeam from '../../hooks/useFetchTeam'
import TeamsLandingPageSection from './TeamsLandingPageSection'
import CreateChannel from '../../components/CreateTeam/CreateChannel'
import { setNotification } from '../../store/actions/auth'


/**
 * TeamLanding Page
 * @component
 */

function TeamsLandingPage(props) {
    const context = useContext(SocketContext)
    const [modelOpen, setmodelOpen] = useState(false)
    const {teamID}= useParams()
    const dispatch = useDispatch()
    const token = useSelector(state => state.auth.token)
    const {data,isLoading,error,refetch}=useFetchTeam(teamID);
    useEffect(()=>{
        if(token)refetch(teamID);
    },[teamID,token])
    
    return (
        <DashboardLayout>
            <Content
            id="main-content"
            className="chatpage__wrapper teamspage__wrapper">
                  <Grid className="chatpage__grid" fullWidth>
                      <Row className="chatpage__row">
                          <Column sm={4} md={2} lg={3} className="chat_tabs__area">
                             {data&& <TeamBar team={data} setOpen={setmodelOpen}/>}
                          </Column>
                          <Column sm={4} md={6} lg={13} style={{height:"100%",padding:"0rem"}} className="userchat">
                             <div className="chatpage_head">
                                <div>
                                    <Workspace20 className="user__profile"/>
                                    <div>
                                    <h6>{data?.channel_name}</h6>
                                    <p>{data?.description}</p> 
                                    </div>
                                </div>
                                
                                <div className="chathead__call">
                                    <UserSimulation16 />
                                </div>
                             </div>
                             <TeamsLandingPageSection setOpen={setmodelOpen}/>
                             <div style={{padding:"1rem",display:"grid",placeItems:"center"}}>
                             <CreateChannel teamID={teamID} open={modelOpen} setOpen={setmodelOpen} refetch={refetch}/>
                             </div>
                          </Column>
                      </Row>
                  </Grid>
            </Content>
        </DashboardLayout>
    )
}

export default TeamsLandingPage
