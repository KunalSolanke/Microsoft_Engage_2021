import {useQuery} from "react-query"
import { getMyTeams} from '../http/requests';
const useFetchTeams= (token)=>{
    let {data,isLoading,error,refetch} = useQuery("getTeams",()=>getMyTeams(token=token), {
    refetchOnWindowFocus: true,
    enabled: false // turned off by default, manual refetch is needed
})
   data=data||[];
    return {data,isLoading,error,refetch}
}

export default useFetchTeams