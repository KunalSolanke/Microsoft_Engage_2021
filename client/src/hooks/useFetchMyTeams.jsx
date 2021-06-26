import {useQuery} from "react-query"
import { getMyTeams} from '../http/requests';
const useFetchTeams= (token)=>{
    let {data,isLoading,error,refetch} = useQuery("getTeams",()=>getMyTeams(token=token), {
    refetchOnWindowFocus: true,
    enabled: false // turned off by default, manual refetch is needed
})
   data=data||[];
   data = data.map(team=>({
        heading:team.channel_name, 
        copy:team.description,
        cta:{
            href:`/dashboard/teams/${team._id}`
        }
    }))
    return {data,isLoading,error,refetch}
}

export default useFetchTeams