import { Content } from 'carbon-components-react'
import React, { useEffect } from 'react'
import DashboardLayout from '../../layouts/DashboardLayout/DashboardLayout'
import "./_styles.css"
import activityImage from "../../assets/images/activity.jpg"
import LocalLoading from '../../components/Loading/LocalLoading'
import useFetchActivity from '../../hooks/useFetchActivity'
import { useSelector } from 'react-redux'
import Log from '../../components/Message/Log'

function Activity() {
    const {data,isLoading,error,refetch}=useFetchActivity();
    const token = useSelector(state => state.auth.token)
    useEffect(()=>{
        if(token)refetch();
    },[token])
    return (
        <DashboardLayout>
            <Content
            id="main-content"
            className="chatpage__wrapper activity__wrapper">
            <div className="activity__block">
                <h4 style={{textAlign:"center"}}>Your recent activities</h4>
                <div className="activity_landing_head">
                    <img src={activityImage}/>
                </div>
                <div className="activity__area">
                 <p style={{textAlign:"center"}}>Activities</p>
                 {isLoading?<LocalLoading/>:<>
                            {data?.logs.map(m=>{
                                return <Log log={m}/>
                            })}
                 </>}

                </div>
            </div>
        </Content>
        </DashboardLayout>
    )
}

export default Activity
