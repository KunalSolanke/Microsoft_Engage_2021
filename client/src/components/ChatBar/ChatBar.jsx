import { Add16, Chat20 } from '@carbon/icons-react'
import React, { useEffect } from 'react'
import { getMyContacts } from '../../http/requests'
import LocalLoading from '../Loading/LocalLoading'
import ChatTile from './ChatTile'
import {Button} from "carbon-components-react"
import {useQuery} from "react-query"
import "./_styles.css"
import { useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'

const useFetchChats= (token)=>{
    const {data,isLoading,error,refetch} = useQuery("getContacts",()=>getMyContacts(token=token), {
  refetchOnWindowFocus: true,
  enabled: false // turned off by default, manual refetch is needed
})
    return {data,isLoading,error,refetch}
}


function ChatBar() {
    const token = useSelector(state => state.auth.token)
    const {data,isLoading,error,refetch} = useFetchChats(token);
    const history = useHistory()
    useEffect(() => {
       if(token)refetch();
    }, [token])
    const getTilesArea = ()=>{
        if(isLoading)return <LocalLoading/>
        if(!error&&data&&data.length){
            return (<>{data.map(tile=><ChatTile chat={tile.chat} key={tile.chat._id}last_message={tile.last_message}/>)}</>)
        }else{
            return (
                <>
                   <div className="tiles__empty_state">
                       <div>
                    <p>You don't have any contacts yet</p>
                       <Button isExpressive size="default" renderIcon={Add16} kind="primary" onClick={()=>history.push("/dashboard/meet")}>
                        Add
                        </Button>
                        </div>
                   </div>
                </>
            )
        }
    }
    return (
        <div style={{"height":"100%"}} className="chatbar">
          <div className="chatbar__head">
              <Chat20></Chat20>
             <h5>Chat</h5>
          </div>
          <hr color="#ededed"/>
          <div className="chattiles__area">
             {getTilesArea()}
          </div>
            
        </div>
    )
}

export default ChatBar
