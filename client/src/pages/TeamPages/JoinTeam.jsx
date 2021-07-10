import { Button, Content } from 'carbon-components-react'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory, useParams } from 'react-router-dom'
import useFetchTeam from '../../hooks/useFetchTeam'
import useJoinTeam from '../../hooks/useJoinTeam'
import joinTeamImg from "../../assets/images/joint_team.png"
import DashboardLayout from '../../layouts/DashboardLayout/DashboardLayout'
import "./_styles.css"
import { joinTeam } from '../../http/requests'
import { setNotification } from '../../store/actions/auth'


/**
 * Join team
 * Show join team cta
 * @component
 */

function JoinTeam() {
    const {teamID} = useParams();
    const token = useSelector(state => state.auth.token)
    const {data,isLoading,error,refetch}=useFetchTeam(teamID);
    const joinedTeam = useJoinTeam(teamID)
    const history = useHistory();
    const dispatch = useDispatch()
    useEffect(()=>{
        if(token)refetch(teamID);
    },[teamID,token])
    const handleJoin = ()=>{
       joinedTeam.refetch(teamID);
       history.push(`/dashboard/teams/${teamID}`)
       dispatch(setNotification("Success","Successfully joined the team","success"))
    }
    return (
       <DashboardLayout>
            <Content
            id="main-content"
            className="chatpage__wrapper">
            <div className="join_team_wrapper">
                <div>

                <p>Join team {data?.channel_name} from link below</p>
                <div className="teams_landing_head">
                    <img src={joinTeamImg}/>
                </div>
                <div className="teams_landing_cta">
                   <Button kind="danger--tertiary" size="sm" onClick={()=>handleJoin()}>Join Team</Button>
                </div>
                </div>
            </div>
            </Content>
            
      </DashboardLayout>
    )
}

export default JoinTeam
