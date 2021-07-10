import { Button, Content } from 'carbon-components-react'
import React, { useEffect, useState } from 'react'
import DashboardLayout from '../../layouts/DashboardLayout/DashboardLayout'
import {CardGroup} from "@carbon/ibmdotcom-react"
import "./_styles.css"
import { Add16 } from '@carbon/icons-react'
import searchImage from "../../assets/images/teams.jpeg"
import CreateTeam from '../../components/CreateTeam/CreateTeam'
import { useSelector } from 'react-redux'
import useFetchTeams from '../../hooks/useFetchMyTeams'
import TeamCard from './TeamCard'
import LocalLoading from '../../components/Loading/LocalLoading'

/**
 * Teams component
 * display list of user's teams
 * @component
 */

function TeamsPage() {
    const token = useSelector(state => state.auth.token)
    const {data,isLoading,error,refetch} = useFetchTeams(token);
    
    useEffect(() => {
       if(token)refetch();
    }, [token])
    const [modelOpen, setmodelOpen] = useState(false)
    return (
        <DashboardLayout>
            <Content
            id="main-content"
            className="dashboard_main_area teams__page"
            >
                <div className="teams__cards">
                   <div className="bx--grid bx--content-group-story">
                        <div className="teams__page__head">
                            <h4>My Teams</h4>
                            <Button
                            isExpressive
                            renderIcon={Add16}
                            hasIconOnly
                            iconDescription="Create Team"
                            onClick={(e)=>setmodelOpen(true)}
                            >
                                Create
                                </Button>
                        </div>
                        <div className="bx--row">
                            {isLoading?<LocalLoading/>:(
                            <div className="bx--col-sm-4 bx--col-lg-12 bx--offset-lg-2">
                                <div data-autoid="dds--card-group" className="bx--card-group__cards__row bx--row--condensed">
                                    {data?.map(card=>(
                                        <TeamCard card={card}/>
                                    ))}
                              </div>
                            </div>
                            )
                                    }
                        </div>
                   </div>
                   {data&&data.length<=3?<div className="teams__page__banner">
                                    
                                    <div>
                                        <img src={searchImage} className="teams__call"/>
                                        <p style={{marginTop:"1rem"}}>Create teams with your friends</p>
                                    </div>
                                    
                </div>:null}
                </div>
                <CreateTeam open={modelOpen} setOpen={setmodelOpen} refetch={refetch}/>
            </Content>
        </DashboardLayout>
    )
}

export default TeamsPage
